import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

const territories = [
  "Manikganj", "Jamalpur", "Mymensingh", "Dhaka North", "Netrokona", "Feni", "Natore", "Munshiganj", 
  "Khulna", "Jhenaidah", "Borguna", "Chandpur", "Rajshahi", "Nilphamari", "Dhaka-3", "Rangpur", 
  "B. Baria", "Kushtia", "Sirajganj", "Tongi", "Narshingdi", "Laxmipur", "Thakurgaon", "Noakhali", 
  "Savar", "Tangail", "Gazipur", "Chapainawabgonj", "Dhaka South", "Gopalganj", "Jashore", "Kishoreganj", 
  "Cumilla 1", "Chattogram North", "Bogura", "Narayanganj", "Barisal", "Hobiganj", "Dinajpur", "Chattogram South", 
  "Madaripur", "Sylhet", "Cumilla-2", "Cox's Bazar"
];

export async function POST(req: Request) {
  try {
    console.log('Seeding database via Edge API...');

    // 1. Clear existing database
    await prisma.dailyPerformance.deleteMany();
    await prisma.match.deleteMany();
    await prisma.playerMVP.deleteMany();
    await prisma.territory.deleteMany();

    // 2. Insert territories
    const divisions = ["Elite", "Champions", "Warriors", "Challengers"];
    for (let i = 0; i < territories.length; i++) {
      const divisionIndex = Math.floor(i / 11);
      await prisma.territory.create({
        data: {
          name: territories[i],
          division: divisions[divisionIndex] || "Challengers",
        }
      });
    }

    const allTerritories = await prisma.territory.findMany();

    // 3. Generate 5 days of random performance data
    const today = new Date();
    for (let d = 0; d < 5; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      date.setHours(0, 0, 0, 0);
      
      for (const terr of allTerritories) {
        const newSalesFoton = Math.floor(Math.random() * 10);
        const newSalesMahindra = Math.floor(Math.random() * 5);
        const resale = Math.floor(Math.random() * 8);
        const recoveryScore = Math.random() * 40; // Out of 40%
        
        const newSalesScore = Math.min((newSalesFoton + newSalesMahindra) * 3, 20);
        const resaleScore = Math.min(resale * 5, 30);
        const extraResaleUnits = Math.max(0, resale - 6);
        const mahindraBonus = Math.min((newSalesMahindra * 2) + (extraResaleUnits * 2), 10);
        const salesPerformanceScore = newSalesScore + resaleScore;
        const totalDailyScore = salesPerformanceScore + recoveryScore + mahindraBonus;

        await prisma.dailyPerformance.create({
          data: {
            date,
            territoryId: terr.id,
            newSalesFoton,
            newSalesMahindra,
            resale,
            salesPerformanceScore,
            recoveryPerformanceScore: recoveryScore,
            mahindraBonusScore: mahindraBonus,
            totalDailyScore
          }
        });
      }
    }

    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get('redirect');
    if (redirectTo) {
      return Response.redirect(new URL(redirectTo, req.url), 303);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully with 44 territories and 5 days of history!' });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    const { searchParams } = new URL(req.url);
    const redirectTo = searchParams.get('redirect');
    if (redirectTo) {
      return Response.redirect(new URL(`${redirectTo}?error=${encodeURIComponent(error?.message || 'Failed to seed')}`, req.url), 303);
    }
    return NextResponse.json({ error: error?.message || 'Failed to seed database' }, { status: 500 });
  }
}
