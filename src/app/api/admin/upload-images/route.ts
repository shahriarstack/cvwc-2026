import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function GET() {
  try {
    let config = await prisma.spotlightConfig.findUnique({
      where: { id: 'default' }
    });
    
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

    // Convert file uploads to Base64 strings
    if (strikerFile && strikerFile.size > 0) {
      const buffer = await strikerFile.arrayBuffer();
      const base64Str = Buffer.from(buffer).toString('base64');
      strikerImageBase64 = `data:${strikerFile.type};base64,${base64Str}`;
    }

    if (goalkeeperFile && goalkeeperFile.size > 0) {
      const buffer = await goalkeeperFile.arrayBuffer();
      const base64Str = Buffer.from(buffer).toString('base64');
      goalkeeperImageBase64 = `data:${goalkeeperFile.type};base64,${base64Str}`;
    }

    const updateData: any = {};
    if (strikerName !== null) updateData.strikerName = strikerName.trim();
    if (goalkeeperName !== null) updateData.goalkeeperName = goalkeeperName.trim();
    if (strikerImageBase64 !== undefined) updateData.strikerImage = strikerImageBase64;
    if (goalkeeperImageBase64 !== undefined) updateData.goalkeeperImage = goalkeeperImageBase64;

    const createData = {
      id: 'default',
      strikerName: strikerName?.trim() || '',
      goalkeeperName: goalkeeperName?.trim() || '',
      strikerImage: strikerImageBase64 || '',
      goalkeeperImage: goalkeeperImageBase64 || ''
    };

    await prisma.spotlightConfig.upsert({
      where: { id: 'default' },
      update: updateData,
      create: createData
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error handling database-driven spotlight customization:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
