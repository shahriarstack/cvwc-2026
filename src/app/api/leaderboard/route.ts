import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function GET() {
  try {
    const rawTerritories = await prisma.territory.findMany({
      include: {
        performances: true
      }
    });

    const territories = rawTerritories.map(t => ({
      ...t,
      performances: t.performances.map(p => ({
        ...p,
        date: p.date.toISOString()
      }))
    }));

    return NextResponse.json({ territories });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
