import { prisma } from "@/lib/prisma";
import Dashboard from "@/components/Dashboard";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function Home() {
  let rawTerritories: any[] = [];
  let spotlightOverrides = { strikerName: '', goalkeeperName: '', strikerImageBase64: '', goalkeeperImageBase64: '' };
  let dbError: string | null = null;
  let dbErrorDetails: string | null = null;

  try {
    // Fetch all territories and their historical performances
    rawTerritories = await prisma.territory.findMany({
      include: {
        performances: true
      }
    });

    // Read spotlight customizations from database instead of static files
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
  } catch (error: any) {
    console.error("Critical Database Fetch Error:", error);
    dbError = error?.message || String(error);
    dbErrorDetails = error?.stack || JSON.stringify(error, Object.getOwnPropertyNames(error));
  }

  // 1. Database Connection Error Diagnostic Screen
  if (dbError) {
    return (
      <main className="container py-8" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.15)',
          padding: '2.5rem',
          maxWidth: '800px',
          width: '90%',
          fontFamily: 'var(--font-outfit), system-ui, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>🚨</span>
            <div>
              <h2 style={{ margin: 0, color: '#b91c1c', fontSize: '1.75rem', fontWeight: 800 }}>Database Connection Error</h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', fontSize: '0.9rem' }}>
                The application successfully compiled but failed to connect to your Neon Postgres database.
              </p>
            </div>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#991b1b',
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap'
          }}>
            <strong>Error Message:</strong><br />
            {dbError}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1f2937' }}>How to Fix This:</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>
                <strong>Missing or Invalid Environment Variable:</strong> Ensure <code>DATABASE_URL</code> is added in your Cloudflare Pages dashboard under <strong>Settings → Environment Variables</strong> (add it to both <em>Production</em> and <em>Preview</em>).
              </li>
              <li>
                <strong>Pooled Connection Required:</strong> If using Neon, ensure you copy the <strong>Pooled Connection Mode</strong> string (which has <code>-pooler</code> in the domain name) and not the direct one.
              </li>
              <li>
                <strong>Compatibility Flags:</strong> Ensure the <code>nodejs_compat</code> compatibility flag is enabled under your Cloudflare Pages project Settings.
              </li>
            </ul>
          </div>

          <details style={{ cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.5rem' }}>View Technical Stack Trace</summary>
            <pre style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#374151',
              overflowX: 'auto',
              maxHeight: '200px',
              fontFamily: 'monospace'
            }}>
              {dbErrorDetails}
            </pre>
          </details>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a 
              href="/" 
              style={{
                background: '#1f2937',
                color: 'white',
                textDecoration: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              🔄 Retry Connection
            </a>
            <a 
              href="/admin" 
              style={{
                background: '#f3f4f6',
                color: '#1f2937',
                textDecoration: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              ⚙️ Go to Admin Panel
            </a>
          </div>
        </div>
      </main>
    );
  }

  // 2. Empty Database Diagnostic Screen (Successful connection, but no tables seeded)
  if (rawTerritories.length === 0) {
    return (
      <main className="container py-8" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          border: '2px solid #d97706',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(217, 119, 6, 0.15)',
          padding: '2.5rem',
          maxWidth: '800px',
          width: '90%',
          fontFamily: 'var(--font-outfit), system-ui, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem' }}>📭</span>
            <div>
              <h2 style={{ margin: 0, color: '#b45309', fontSize: '1.75rem', fontWeight: 800 }}>Database Connection Successful, but Empty</h2>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', fontSize: '0.9rem' }}>
                Your Neon PostgreSQL database is connected, but there are no territories or standings recorded in it.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px' }}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem', lineHeight: '1.5' }}>
              To display the World Cup leaderboard, we need to populate the database with the 44 default territories and 5 days of initial cumulative standings. You can do this automatically with one click below!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <form action="/api/admin/seed?redirect=/" method="POST" style={{ display: 'inline-block', margin: 0 }}>
              <button 
                type="submit" 
                style={{
                  background: '#d97706',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
                }}
              >
                🌱 Seed Standings Database
              </button>
            </form>
            <a 
              href="/admin" 
              style={{
                background: '#f3f4f6',
                color: '#1f2937',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'inline-block'
              }}
            >
              ⚙️ Go to Admin Panel
            </a>
          </div>
        </div>
      </main>
    );
  }

  // 3. Normal Standing Dashboard Flow
  // Serialize Date objects to strings for Client Component boundary
  const territories = rawTerritories.map((t: any) => ({
    ...t,
    performances: t.performances.map((p: any) => ({
      ...p,
      date: p.date.toISOString()
    }))
  }));

  return (
    <main>
      {/* Epic sunlit ACI Motors & FIFA Stadium Title Section */}
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
