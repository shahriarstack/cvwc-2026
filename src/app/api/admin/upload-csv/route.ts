import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { calculateDailyScore } from '@/lib/scoring';

export const runtime = 'edge';

// Pure JavaScript CSV parser (100% compatible with Edge environments, zero Node.js dependencies)
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];
  
  let headerIndex = 0;
  while (headerIndex < lines.length && !lines[headerIndex].trim()) {
    headerIndex++;
  }
  if (headerIndex >= lines.length) return [];
  
  const headerLine = lines[headerIndex];
  // Detect delimiter (tab, semicolon, or comma)
  const delimiter = headerLine.includes('\t') ? '\t' : (headerLine.includes(';') ? ';' : ',');
  
  const rawHeaders = headerLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  
  // Fuzzy match headers to expected keys
  const headerMap = rawHeaders.map(h => {
    const norm = h.replace(/[^a-z0-9]/g, '');
    if (norm.includes('territory') || norm === 'name') return 'territoryName';
    if (norm.includes('foton')) return 'newSalesFoton';
    if (norm.includes('mahindra')) return 'newSalesMahindra';
    if (norm.includes('resale')) return 'resale';
    if (norm.includes('recovery')) return 'recoveryPercentage';
    return h;
  });

  const results: Record<string, string>[] = [];
  
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));
    
    const record: Record<string, string> = {};
    headerMap.forEach((mappedHeader, index) => {
      record[mappedHeader] = values[index] || '';
    });
    // Also include raw headers for fallback
    rawHeaders.forEach((raw, index) => {
        if (!record[raw]) record[raw] = values[index] || '';
    });
    
    results.push(record);
  }
  return results;
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

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
    
    const records = parseCSV(text);

    const territories = await sql`SELECT * FROM "Territory"`;
    const territoryMap = new Map(territories.map(t => [normalizeName(t.name), t.id]));

    let processed = 0;

    for (const record of records) {
      const rawTName = record.territoryName?.trim() || record.name?.trim();
      if (!rawTName) continue;
      
      const tName = normalizeName(rawTName);
      if (!territoryMap.has(tName)) continue;

      const territoryId = territoryMap.get(tName)!;
      const newSalesFoton = parseInt(record.newSalesFoton) || 0;
      const newSalesMahindra = parseInt(record.newSalesMahindra) || 0;
      const resale = parseInt(record.resale) || 0;
      
      // Handle percentages like "45%" or "45.5"
      let rawRecovery = record.recoveryPercentage || '0';
      rawRecovery = rawRecovery.replace('%', '').trim();
      const recoveryPercentage = parseFloat(rawRecovery) || 0;

      const scores = calculateDailyScore({ newSalesFoton, newSalesMahindra, resale, recoveryPercentage });
      
      const perfId = crypto.randomUUID();
      const dateIso = date.toISOString();

      await sql`
        INSERT INTO "DailyPerformance" (
          "id", "date", "territoryId", "newSalesFoton", "newSalesMahindra", "resale", 
          "salesPerformanceScore", "recoveryPerformanceScore", "mahindraBonusScore", "totalDailyScore"
        ) VALUES (
          ${perfId}, ${dateIso}, ${territoryId}, ${newSalesFoton}, ${newSalesMahindra}, ${resale}, 
          ${scores.salesPerformanceScore}, ${scores.recoveryPerformanceScore}, ${scores.mahindraBonusScore}, ${scores.totalDailyScore}
        )
        ON CONFLICT ("date", "territoryId") 
        DO UPDATE SET 
          "newSalesFoton" = EXCLUDED."newSalesFoton",
          "newSalesMahindra" = EXCLUDED."newSalesMahindra",
          "resale" = EXCLUDED."resale",
          "salesPerformanceScore" = EXCLUDED."salesPerformanceScore",
          "recoveryPerformanceScore" = EXCLUDED."recoveryPerformanceScore",
          "mahindraBonusScore" = EXCLUDED."mahindraBonusScore",
          "totalDailyScore" = EXCLUDED."totalDailyScore"
      `;
      processed++;
    }

    return NextResponse.json({ success: true, processed });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
