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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
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
    <div className="ticker-wrap hidden md:flex">
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
    <>
      {/* Top Navbar - Used for branding on mobile, and full nav on desktop */}
      <nav className="top-navbar" style={{ 
        background: 'rgba(255, 255, 255, 0.85)', 
        borderBottom: '1px solid rgba(223, 183, 44, 0.25)',
        boxShadow: '0 4px 20px rgba(124, 18, 36, 0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}>
        <div className="container flex items-center justify-center md:justify-between py-2 md:py-3">
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
              fontSize: '1.25rem', 
              fontWeight: 900, 
              color: 'var(--fifa-burgundy)', 
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              CVWC 2026
            </span>
          </Link>

          {/* Desktop Nav Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center" style={{ gap: '1.25rem' }}>
            <Link href="/" className="font-bold tab-btn nav-link">
              📋 Standings
            </Link>
            <Link href="/matches" className="font-bold tab-btn nav-link">
              ⚔️ Fixtures
            </Link>
            <Link href="/admin" className="font-bold tab-btn nav-link">
              ⚙️ Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* App-like Bottom Navigation Bar (Visible only on mobile) */}
      <div className="mobile-bottom-nav md:hidden" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)' // Safe area for iOS
      }}>
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-accent transition-colors" style={{ gap: '0.2rem' }}>
          <span style={{ fontSize: '1.25rem' }}>📋</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Standings</span>
        </Link>
        
        <Link href="/matches" className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-accent transition-colors" style={{ gap: '0.2rem', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            background: 'linear-gradient(135deg, var(--fifa-burgundy-light) 0%, var(--fifa-burgundy) 100%)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(124, 18, 36, 0.4)',
            border: '2px solid #fff'
          }}>
            <span style={{ fontSize: '1.3rem' }}>⚔️</span>
          </div>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '22px' }}>Fixtures</span>
        </Link>
        
        <Link href="/admin" className="flex flex-col items-center justify-center w-full h-full text-secondary hover:text-accent transition-colors" style={{ gap: '0.2rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚙️</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Admin</span>
        </Link>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="pb-24 md:pb-6" style={{
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderTop: '1px solid rgba(124, 18, 36, 0.08)',
      paddingTop: '1.25rem',
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
