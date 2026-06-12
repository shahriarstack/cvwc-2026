import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';
export async function GET() {
  try {
    const dbTerritories = await sql`SELECT * FROM "Territory"`;
    const performances = await sql`SELECT * FROM "DailyPerformance"`;

    // Group performances by territoryId
    const perfMap = new Map<string, any[]>();
    for (const p of performances) {
      if (!perfMap.has(p.territoryId)) {
        perfMap.set(p.territoryId, []);
      }
      perfMap.get(p.territoryId)!.push(p);
    }

    const rawTerritories = dbTerritories.map(t => ({
      ...t,
      performances: perfMap.get(t.id) || []
    }));

    const territories = rawTerritories.map(t => ({
      ...t,
      performances: t.performances.map(p => ({
        ...p,
        date: new Date(p.date).toISOString()
      }))
    }));

    return NextResponse.json({ territories });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
