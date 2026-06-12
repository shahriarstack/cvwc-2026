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
        goalkeeperImage: '',
        goalkeeper2Name: '',
        goalkeeper2Image: ''
      };
    }
    
    return NextResponse.json({
      strikerName: config.strikerName || '',
      goalkeeperName: config.goalkeeperName || '',
      strikerImage: config.strikerImage || '',
      goalkeeperImage: config.goalkeeperImage || '',
      goalkeeper2Name: config.goalkeeper2Name || '',
      goalkeeper2Image: config.goalkeeper2Image || ''
    });
  } catch (error) {
    console.error('Error in GET upload-images:', error);
    return NextResponse.json({ strikerName: '', goalkeeperName: '', strikerImage: '', goalkeeperImage: '', goalkeeper2Name: '', goalkeeper2Image: '' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const strikerFile = formData.get('striker') as File | null;
    const goalkeeperFile = formData.get('goalkeeper') as File | null;
    const goalkeeper2File = formData.get('goalkeeper2') as File | null;
    const strikerName = formData.get('strikerName') as string | null;
    const goalkeeperName = formData.get('goalkeeperName') as string | null;
    const goalkeeper2Name = formData.get('goalkeeper2Name') as string | null;

    let strikerImageBase64 = undefined;
    let goalkeeperImageBase64 = undefined;
    let goalkeeper2ImageBase64 = undefined;

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

    if (goalkeeper2File && goalkeeper2File.size > 0) {
      const buffer = await goalkeeper2File.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Str = btoa(binary);
      goalkeeper2ImageBase64 = `data:${goalkeeper2File.type};base64,${base64Str}`;
    }

    const configs = await sql`SELECT * FROM "SpotlightConfig" WHERE id = 'default' LIMIT 1`;
    const config = configs[0] || {
      id: 'default',
      strikerName: '',
      goalkeeperName: '',
      strikerImage: '',
      goalkeeperImage: '',
      goalkeeper2Name: '',
      goalkeeper2Image: ''
    };

    const finalStrikerName = strikerName !== null ? strikerName.trim() : config.strikerName;
    const finalGoalkeeperName = goalkeeperName !== null ? goalkeeperName.trim() : config.goalkeeperName;
    const finalGoalkeeper2Name = goalkeeper2Name !== null ? goalkeeper2Name.trim() : config.goalkeeper2Name;
    const finalStrikerImage = strikerImageBase64 !== undefined ? strikerImageBase64 : config.strikerImage;
    const finalGoalkeeperImage = goalkeeperImageBase64 !== undefined ? goalkeeperImageBase64 : config.goalkeeperImage;
    const finalGoalkeeper2Image = goalkeeper2ImageBase64 !== undefined ? goalkeeper2ImageBase64 : config.goalkeeper2Image;

    await sql`
      INSERT INTO "SpotlightConfig" ("id", "strikerName", "goalkeeperName", "strikerImage", "goalkeeperImage", "goalkeeper2Name", "goalkeeper2Image")
      VALUES ('default', ${finalStrikerName}, ${finalGoalkeeperName}, ${finalStrikerImage}, ${finalGoalkeeperImage}, ${finalGoalkeeper2Name}, ${finalGoalkeeper2Image})
      ON CONFLICT ("id")
      DO UPDATE SET
        "strikerName" = EXCLUDED."strikerName",
        "goalkeeperName" = EXCLUDED."goalkeeperName",
        "strikerImage" = EXCLUDED."strikerImage",
        "goalkeeperImage" = EXCLUDED."goalkeeperImage",
        "goalkeeper2Name" = EXCLUDED."goalkeeper2Name",
        "goalkeeper2Image" = EXCLUDED."goalkeeper2Image"
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling database-driven spotlight customization:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
