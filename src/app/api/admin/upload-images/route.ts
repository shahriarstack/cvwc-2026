import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

export async function GET() {
  try {
    const configs = await sql`SELECT * FROM "SpotlightConfig" WHERE id = 'default' LIMIT 1`;
    let config = configs[0];
    
    if (!config) {
      config = {
        id: 'default',
        strikerName: '',
        goalkeeperName: '',
        strikerImage: '',
        goalkeeperImage: ''
      };
    }
    
    return NextResponse.json({
      strikerName: config.strikerName || '',
      goalkeeperName: config.goalkeeperName || '',
      strikerImage: config.strikerImage || '',
      goalkeeperImage: config.goalkeeperImage || ''
    });
  } catch (error) {
    console.error('Error in GET upload-images:', error);
    return NextResponse.json({ strikerName: '', goalkeeperName: '', strikerImage: '', goalkeeperImage: '' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const strikerFile = formData.get('striker') as File | null;
    const goalkeeperFile = formData.get('goalkeeper') as File | null;
    const strikerName = formData.get('strikerName') as string | null;
    const goalkeeperName = formData.get('goalkeeperName') as string | null;

    let strikerImageBase64 = undefined;
    let goalkeeperImageBase64 = undefined;

    // Convert file uploads to Base64 strings using standard Edge-compatible Web APIs (btoa)
    if (strikerFile && strikerFile.size > 0) {
      const buffer = await strikerFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Str = btoa(binary);
      strikerImageBase64 = `data:${strikerFile.type};base64,${base64Str}`;
    }

    if (goalkeeperFile && goalkeeperFile.size > 0) {
      const buffer = await goalkeeperFile.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Str = btoa(binary);
      goalkeeperImageBase64 = `data:${goalkeeperFile.type};base64,${base64Str}`;
    }

    const configs = await sql`SELECT * FROM "SpotlightConfig" WHERE id = 'default' LIMIT 1`;
    const config = configs[0] || {
      id: 'default',
      strikerName: '',
      goalkeeperName: '',
      strikerImage: '',
      goalkeeperImage: ''
    };

    const finalStrikerName = strikerName !== null ? strikerName.trim() : config.strikerName;
    const finalGoalkeeperName = goalkeeperName !== null ? goalkeeperName.trim() : config.goalkeeperName;
    const finalStrikerImage = strikerImageBase64 !== undefined ? strikerImageBase64 : config.strikerImage;
    const finalGoalkeeperImage = goalkeeperImageBase64 !== undefined ? goalkeeperImageBase64 : config.goalkeeperImage;

    await sql`
      INSERT INTO "SpotlightConfig" ("id", "strikerName", "goalkeeperName", "strikerImage", "goalkeeperImage")
      VALUES ('default', ${finalStrikerName}, ${finalGoalkeeperName}, ${finalStrikerImage}, ${finalGoalkeeperImage})
      ON CONFLICT ("id")
      DO UPDATE SET
        "strikerName" = EXCLUDED."strikerName",
        "goalkeeperName" = EXCLUDED."goalkeeperName",
        "strikerImage" = EXCLUDED."strikerImage",
        "goalkeeperImage" = EXCLUDED."goalkeeperImage"
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling database-driven spotlight customization:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
