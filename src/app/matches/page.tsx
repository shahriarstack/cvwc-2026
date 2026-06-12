import { prisma, resolvedDatabaseUrl } from "@/lib/prisma";
import FixtureCenter from "@/components/FixtureCenter";

function maskConnectionString(url: string): string {
  if (!url) return "[Empty]";
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "********";
    }
    return parsed.toString();
  } catch (e) {
    return url.replace(/(postgresql:\/\/.*:)(.*)(@.*)/, "$1********$3");
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function MatchesPage() {
  let rawTerritories: any[] = [];
  let dbError: string | null = null;
  let dbErrorDetails: string | null = null;

  try {
    // Query all territories and historical sales data for match simulations
    rawTerritories = await prisma.territory.findMany({
      include: {
        performances: true
      }
    });
  } catch (error: any) {
    console.error("Critical Database Fetch Error (Matches):", error);
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
                Failed to retrieve match fixture data from the database.
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
            <hr style={{ margin: '0.75rem 0', borderColor: 'rgba(239, 68, 68, 0.2)' }} />
            <strong>Resolved Connection String:</strong><br />
            {maskConnectionString(resolvedDatabaseUrl)}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#1f2937' }}>Common Causes & Solutions:</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#374151', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>
                <strong>Missing Environment Variable:</strong> Check if <code>DATABASE_URL</code> is set under your Cloudflare dashboard environment variables.
              </li>
              <li>
                <strong>Non-Pooled Neon String:</strong> Ensure the connection string uses the Neon pooler endpoint (with <code>-pooler</code> in the hostname).
              </li>
              <li>
                <strong>Prisma Client Out of Sync:</strong> Rebuild or push schema via your local command line.
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
              href="/matches" 
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
                Your Neon database is connected, but there are no territories or standing data available for match simulations.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px' }}>
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem', lineHeight: '1.5' }}>
              To compute matches, we need to populate the database with the default territories first. You can run the database seeding script immediately below.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <form action="/api/admin/seed?redirect=/matches" method="POST" style={{ display: 'inline-block', margin: 0 }}>
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
          </div>
        </div>
      </main>
    );
  }

  // 3. Normal Flow
  // Serialize Date objects to strings for Client Component boundary
  const territories = rawTerritories.map((t: any) => ({
    ...t,
    performances: t.performances.map((p: any) => ({
      ...p,
      date: p.date.toISOString()
    }))
  }));

  return (
    <FixtureCenter initialTerritories={territories} />
  );
}
