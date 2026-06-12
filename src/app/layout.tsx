import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import StadiumBackground from "@/components/StadiumBackground";
import LoadingScreen from "@/components/LoadingScreen";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACI Motors - CV World Cup 2026",
  description: "ACI Motors Commercial Vehicle Business performance standings leaderboard",
};

function LiveNewsTicker() {
  const tickerItems = [
    "🏆 ACI MOTORS COMMERCIAL VEHICLE WORLD CUP 2026 IS ACTIVE!",
    "⚡ DIVISION SHIFT: Top 11 territories secure Elite status, Bottom 11 fighting relegation in Challengers!",
    "⚽ MATCHDAY RULE: Foton & Mahindra Sales drive 50% of weight, Resales 30%, Recovery percentage 40%!",
    "🔥 SPECIAL BONUS: Mahindra units award +2 bonus points up to a massive 10-point cap!",
    "🌟 STAR HIGHLIGHT: Check out today's Budweiser 'Player of the Match' FUT Cards below!",
    "📈 DAILY AUDIT: Upload performance CSV at the Admin panel to recalculate standings instantly."
  ];

  return (
    <div className="ticker-wrap">
      <div className="ticker-live-tag">LIVE TICKER</div>
      <div className="ticker">
        {tickerItems.map((item, idx) => (
          <span key={idx} className="ticker-item">
            {item}
          </span>
        ))}
        {/* Double items to loop seamlessly */}
        {tickerItems.map((item, idx) => (
          <span key={`loop-${idx}`} className="ticker-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav style={{ 
      background: 'rgba(255, 255, 255, 0.85)', 
      borderBottom: '1px solid rgba(223, 183, 44, 0.25)',
      boxShadow: '0 4px 20px rgba(124, 18, 36, 0.04)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'relative',
      zIndex: 90
    }}>
      <div className="container flex items-center justify-between py-2">
        {/* Sleek logo badge integration */}
        <Link href="/" className="flex items-center" style={{ gap: '0.5rem' }}>
          <div style={{
            background: 'var(--fifa-burgundy)',
            padding: '0.3rem 0.75rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(223, 183, 44, 0.3)',
            boxShadow: '0 2px 8px rgba(124, 18, 36, 0.1)'
          }}>
            <img 
              src="https://i.ibb.co.com/N2kYDkbt/ACI-Motors-Logo-AI-White.png" 
              alt="ACI Motors" 
              style={{ height: '18px', objectFit: 'contain' }}
            />
          </div>
          <span style={{ 
            fontSize: '1.15rem', 
            fontWeight: 800, 
            color: 'var(--fifa-burgundy)', 
            letterSpacing: '0.5px' 
          }}>
            CVWC 2026
          </span>
        </Link>
        <div className="flex items-center" style={{ gap: '1.25rem' }}>
          <Link href="/" className="font-bold tab-btn" style={{ 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem',
            border: '1px solid transparent',
            color: 'var(--text-primary)',
            background: 'transparent',
            boxShadow: 'none'
          }}>
            📋 Standing Tables
          </Link>
          <Link href="/matches" className="font-bold tab-btn" style={{ 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem',
            border: '1px solid transparent',
            color: 'var(--text-primary)',
            background: 'transparent',
            boxShadow: 'none'
          }}>
            ⚔️ Fixtures & Matches
          </Link>
          <Link href="/admin" className="font-bold tab-btn" style={{ 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem',
            border: '1px solid transparent',
            color: 'var(--text-secondary)',
            background: 'transparent',
            boxShadow: 'none'
          }}>
            ⚙️ Admin Panel
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderTop: '1px solid rgba(124, 18, 36, 0.08)',
      padding: '1.25rem 0',
      marginTop: '1.5rem',
      color: 'var(--text-secondary)',
      fontSize: '0.8rem',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(223,183,44,0.3), transparent)'
      }}></div>

      <div className="container">
        {/* Compact premium brand block plaque */}
        <div style={{
          background: 'var(--fifa-burgundy)',
          padding: '0.4rem 1.0rem',
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(223, 183, 44, 0.3)',
          marginBottom: '0.4rem',
          boxShadow: '0 2px 8px rgba(124, 18, 36, 0.1)'
        }}>
          <img 
            src="https://i.ibb.co.com/N2kYDkbt/ACI-Motors-Logo-AI-White.png" 
            alt="ACI Motors" 
            style={{ height: '24px', objectFit: 'contain' }}
          />
        </div>
        
        <div style={{ 
          fontWeight: 600, 
          color: 'var(--text-primary)', 
          fontSize: '0.85rem',
          letterSpacing: '0.5px',
          marginBottom: '0.5rem'
        }}>
          Commercial Vehicle Business
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(124, 18, 36, 0.04)',
          border: '1px solid rgba(223, 183, 44, 0.25)',
          padding: '0.3rem 1.0rem',
          borderRadius: '30px',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--fifa-burgundy-light)',
          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
        }}>
          <span style={{ letterSpacing: '0.5px' }}>FOTON</span>
          <span style={{ color: 'rgba(124, 18, 36, 0.2)', fontWeight: 300 }}>|</span>
          <span style={{ letterSpacing: '0.5px' }}>MAHINDRA</span>
        </div>
        
        <div style={{ marginTop: '1.0rem', fontSize: '0.7rem', opacity: 0.5 }}>
          © {new Date().getFullYear()} ACI Motors CV WC. Standing tables, fixtures, and sales gamification dashboard.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <LoadingScreen />
        <StadiumBackground />
        <LiveNewsTicker />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
