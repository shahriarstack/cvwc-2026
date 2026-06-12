import { prisma } from "@/lib/prisma";
import FixtureCenter from "@/components/FixtureCenter";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function MatchesPage() {
  // Query all territories and historical sales data for match simulations
  const rawTerritories = await prisma.territory.findMany({
    include: {
      performances: true
    }
  });

  // Serialize Date objects to strings for Client Component boundary
  const territories = rawTerritories.map(t => ({
    ...t,
    performances: t.performances.map(p => ({
      ...p,
      date: p.date.toISOString()
    }))
  }));

  return (
    <FixtureCenter initialTerritories={territories} />
  );
}
