import { prisma } from "@/lib/prisma";
import Dashboard from "@/components/Dashboard";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function Home() {
  // Fetch all territories and their historical performances
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

  // Read spotlight customizations from database instead of static files
  let spotlightOverrides = { strikerName: '', goalkeeperName: '', strikerImageBase64: '', goalkeeperImageBase64: '' };
  try {
    const config = await prisma.spotlightConfig.findUnique({
      where: { id: 'default' }
    });
    if (config) {
      spotlightOverrides.strikerName = config.strikerName || '';
      spotlightOverrides.goalkeeperName = config.goalkeeperName || '';
      spotlightOverrides.strikerImageBase64 = config.strikerImage || '';
      spotlightOverrides.goalkeeperImageBase64 = config.goalkeeperImage || '';
    }
  } catch (e) {
    console.error('Error fetching spotlight config from database:', e);
  }

  return (
    <main>
      {/* Epic sunlit ACI Motors & FIFA Stadium Title Section - Compacted */}
      <div 
        className="text-center py-3" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 135, 90, 0.04) 0%, rgba(248, 250, 252, 0) 75%)',
          borderBottom: '1px solid rgba(124, 18, 36, 0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--fifa-gold), transparent)'
        }}></div>

        {/* Compact Center-aligned Logo Plaque */}
        <div className="flex items-center justify-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'var(--fifa-burgundy)',
            padding: '0.4rem 1.0rem',
            borderRadius: '6px',
            border: '1px solid rgba(223, 183, 44, 0.3)',
            boxShadow: '0 2px 8px rgba(124, 18, 36, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src="https://i.ibb.co.com/N2kYDkbt/ACI-Motors-Logo-AI-White.png" 
              alt="ACI Motors" 
              style={{ height: '20px', objectFit: 'contain' }}
            />
          </div>

          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            color: 'var(--fifa-burgundy-light)', 
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            🏆 Commercial Vehicle Business
          </span>
        </div>
        
        <style>{`
          @keyframes lucrativeShine {
            0% { background-position: 0% 50%; filter: drop-shadow(0 4px 10px rgba(223, 183, 44, 0.3)); transform: scale(1); }
            50% { background-position: 100% 50%; filter: drop-shadow(0 8px 25px rgba(223, 183, 44, 0.6)); transform: scale(1.03); }
            100% { background-position: 0% 50%; filter: drop-shadow(0 4px 10px rgba(223, 183, 44, 0.3)); transform: scale(1); }
          }
          .lucrative-title {
            background: linear-gradient(90deg, #b8911f 0%, #dfb72c 25%, #ffffff 50%, #dfb72c 75%, #b8911f 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: lucrativeShine 4s ease-in-out infinite;
          }
        `}</style>
        <h1 className="lucrative-title" style={{ 
          fontSize: 'clamp(1.8rem, 6vw, 3.2rem)', 
          fontWeight: 900,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: '0.8rem 0 0.5rem 0',
          lineHeight: 1.1,
          display: 'inline-block'
        }}>
          CV WORLD CUP 2026
        </h1>
        
        <p className="text-secondary" style={{ fontSize: '0.85rem', maxWidth: '600px', margin: '0.15rem auto 0 auto' }}>
          Official standings leaderboard for <strong style={{ color: 'var(--fifa-burgundy-light)' }}>Foton</strong> & <strong style={{ color: 'var(--fifa-burgundy-light)' }}>Mahindra</strong> recovery squads.
        </p>
      </div>

      {/* Render the core dynamic tabs and leaderboards */}
      <Dashboard initialTerritories={territories} spotlightOverrides={spotlightOverrides} />
    </main>
  );
}
