import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { prisma } from '@/lib/prisma';
import { calculateDailyScore } from '@/lib/scoring';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const dateStr = formData.get('date') as string;

    if (!file || !dateStr) {
      return NextResponse.json({ error: 'File and date are required' }, { status: 400 });
    }

    const date = new Date(dateStr);
    date.setHours(0,0,0,0);
    const text = await file.text();
    
    // Expected CSV Headers: territoryName, newSalesFoton, newSalesMahindra, resale, recoveryPercentage
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true
    }) as any[];

    const territories = await prisma.territory.findMany();
    const territoryMap = new Map(territories.map(t => [t.name.toLowerCase(), t.id]));

    let processed = 0;

    for (const record of records) {
      const tName = record.territoryName?.trim().toLowerCase();
      if (!tName || !territoryMap.has(tName)) continue;

      const territoryId = territoryMap.get(tName)!;
      const newSalesFoton = parseInt(record.newSalesFoton) || 0;
      const newSalesMahindra = parseInt(record.newSalesMahindra) || 0;
      const resale = parseInt(record.resale) || 0;
      const recoveryPercentage = parseFloat(record.recoveryPercentage) || 0;

      const scores = calculateDailyScore({ newSalesFoton, newSalesMahindra, resale, recoveryPercentage });

      await prisma.dailyPerformance.upsert({
        where: {
          date_territoryId: {
            date,
            territoryId
          }
        },
        update: {
          newSalesFoton,
          newSalesMahindra,
          resale,
          ...scores
        },
        create: {
          date,
          territoryId,
          newSalesFoton,
          newSalesMahindra,
          resale,
          ...scores
        }
      });
      processed++;
    }

    return NextResponse.json({ success: true, processed });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
