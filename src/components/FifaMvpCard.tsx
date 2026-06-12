"use client";

import { motion } from "framer-motion";
import CountryFlag from "./CountryFlag";

interface FifaMvpCardProps {
  playerName: string;
  role: string;
  territoryName: string;
  rating: number;
  stats: {
    foton?: number;
    mahindra?: number;
    resale?: number;
    recovery?: number;
  };
  imageSrc?: string;
  isSpotlight?: boolean;
}

export default function FifaMvpCard({
  playerName,
  role,
  territoryName,
  rating,
  stats,
  imageSrc,
  isSpotlight = false
}: FifaMvpCardProps) {
  const isSales = role.toLowerCase().includes("sales") || role.toLowerCase().includes("striker");
  const isMidfielder = role.toLowerCase().includes("midfielder") || role.toLowerCase().includes("tactical");
  const posCode = isSales ? "ST" : isMidfielder ? "MF" : "GK"; // ST = Striker, MF = Midfielder, GK = Goalkeeper

  // 1. STUNNING LARGE VERTICAL FUT SHIELD CARD FOR SPOTLIGHT PLAYERS
  if (isSpotlight) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fifa-card-wrapper spotlight-card"
        style={{
          width: '260px',
          height: '380px',
          perspective: '1000px',
          filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45))'
        }}
      >
        <div 
          className="fifa-card animate-sparkle"
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #ffffff 0%, #dfb72c 30%, #7c1224 50%, #b8911f 70%, #fff5be 100%)',
            position: 'relative',
            padding: '2px',
            borderRadius: '16px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            clipPath: "path('M 10 30 L 130 10 L 250 30 L 250 270 Q 250 335 130 375 Q 10 335 10 270 Z')"
          }}
        >
          {/* Card Shine Reflection */}
          <div className="fifa-card-shine"></div>
          
          {/* Outer Shield Frame SVG */}
          <svg 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 4
            }}
            viewBox="0 0 260 380" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stadium Volumetric Floodlight Ray Overlay */}
            <g opacity="0.12">
              <polygon points="10,30 130,10 130,190 10,270" fill="url(#lightRaySpotL)" />
              <polygon points="250,30 130,10 130,190 250,270" fill="url(#lightRaySpotR)" />
            </g>
            
            {/* Gold Border outline matching the clipPath */}
            <path 
              d="M 10 30 L 130 10 L 250 30 L 250 270 Q 250 335 130 375 Q 10 335 10 270 Z" 
              stroke="url(#goldGradSpot)" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none" 
            />

            <defs>
              <linearGradient id="goldGradSpot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#facc15" />
                <stop offset="70%" stopColor="#b8911f" />
                <stop offset="100%" stopColor="#dfb72c" />
              </linearGradient>
              <linearGradient id="lightRaySpotL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dfb72c" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lightRaySpotR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dfb72c" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Inner Card Background (clipped shield overlay) */}
          <div style={{
            position: 'absolute',
            top: '3px',
            bottom: '3px',
            left: '3px',
            right: '3px',
            background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #080d16 100%)',
            zIndex: 1,
            clipPath: "path('M 12 32 L 130 13 L 248 32 L 248 268 Q 248 331 130 370 Q 12 331 12 268 Z')"
          }}></div>
          
          {/* Main content overlays */}
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Rating & Position (Top Left) */}
            <div style={{
              position: 'absolute',
              top: '32px',
              left: '25px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3
            }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--fifa-gold)', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                {isSales ? (stats.foton || 0) + (stats.mahindra || 0) + (stats.resale || 0) : Math.round(stats.recovery || 0)}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', marginTop: '0.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                {isSales ? "UNITS" : "REC %"}
              </span>
            </div>
            
            {/* Country Flag (Top Right) */}
            <div style={{
              position: 'absolute',
              top: '35px',
              right: '25px',
              zIndex: 3
            }}>
              <CountryFlag countryName={territoryName} />
            </div>
            
            {/* Large Creative Avatar Container */}
            <div style={{
              width: '165px',
              height: '165px',
              margin: '40px auto 0 auto',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}>
              {/* Golden Halo Background Aura */}
              <div style={{
                position: 'absolute',
                width: '135px',
                height: '135px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(223, 183, 44, 0.35) 0%, rgba(124, 18, 36, 0.4) 60%, transparent 100%)',
                filter: 'blur(8px)',
                zIndex: 1
              }} />
              
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '2.5px solid var(--fifa-gold)',
                background: 'radial-gradient(circle, rgba(223, 183, 44, 0.15) 0%, transparent 80%)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(0, 0, 0, 0.5)',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2
              }}>
                {imageSrc ? (
                  <img 
                    src={imageSrc} 
                    alt={playerName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const svg = parent.querySelector('svg');
                        if (svg) svg.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <svg
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    color: 'rgba(250, 204, 21, 0.4)',
                    margin: '30px auto',
                    display: imageSrc ? 'none' : 'block'
                  }}
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <path d="M50 15c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm-22.5 45c-4.1 0-7.5 3.4-7.5 7.5v12.5c0 2.8 2.2 5 5 5h50c2.8 0 5-2.2 5-5V67.5c0-4.1-3.4-7.5-7.5-7.5H27.5z" />
                </svg>
                
                {/* Micro active green status dot */}
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--fifa-pitch-green)',
                  boxShadow: '0 0 8px var(--fifa-pitch-green)',
                  border: '2px solid #000',
                  zIndex: 3
                }}></div>
              </div>
            </div>
            
            {/* Identity info */}
            <div style={{ textAlign: 'center', marginTop: '8px', padding: '0 1.25rem' }}>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 900, 
                color: '#ffffff', 
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {playerName}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                fontWeight: 800, 
                color: 'var(--fifa-gold)', 
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '2px',
                textShadow: '0 1px 3px rgba(0,0,0,0.6)'
              }}>
                {territoryName}
              </div>
              
              {/* Sponsor block */}
              <div style={{
                fontSize: '0.45rem',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.4)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <span>ACI MOTORS</span>
                <span style={{ color: 'var(--fifa-gold)', opacity: 0.6 }}>|</span>
                <span>FOTON</span>
                <span style={{ color: 'var(--fifa-gold)', opacity: 0.6 }}>|</span>
                <span>MAHINDRA</span>
              </div>
            </div>
            
            {/* Stats block */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '4px', 
              borderTop: '1px solid rgba(255,255,255,0.12)', 
              margin: '10px 24px 0 24px',
              paddingTop: '8px'
            }}>
              
              {/* Stats Grid */}
              <div className="flex justify-center items-center" style={{ gap: '0.8rem', width: '100%' }}>
                {isSales ? (
                  <>
                    {/* New Sales Highlight */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.52rem', fontWeight: 600 }}>NEW SALES</span>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
                        {(stats.foton || 0) + (stats.mahindra || 0)} <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>({stats.foton || 0}F/{stats.mahindra || 0}M)</span>
                      </span>
                      <span style={{
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        background: 'rgba(223, 183, 44, 0.12)',
                        border: '1px solid rgba(223, 183, 44, 0.3)',
                        color: 'var(--fifa-gold)',
                        padding: '0.05rem 0.25rem',
                        borderRadius: '3px',
                        marginTop: '2px',
                        whiteSpace: 'nowrap'
                      }}>
                        {Math.min(((stats.foton || 0) + (stats.mahindra || 0)) * 3, 20).toFixed(0)} PTS
                      </span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '1.2rem', alignSelf: 'center' }}>|</span>
                    {/* Resale Sales Highlight */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.52rem', fontWeight: 600 }}>RESALE</span>
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>
                        {stats.resale || 0} <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Units</span>
                      </span>
                      <span style={{
                        fontSize: '0.55rem',
                        fontWeight: 800,
                        background: 'rgba(223, 183, 44, 0.12)',
                        border: '1px solid rgba(223, 183, 44, 0.3)',
                        color: 'var(--fifa-gold)',
                        padding: '0.05rem 0.25rem',
                        borderRadius: '3px',
                        marginTop: '2px',
                        whiteSpace: 'nowrap'
                      }}>
                        {Math.min((stats.resale || 0) * 5, 30).toFixed(0)} PTS
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.5px' }}>EMI RECOVERY RATE</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
                      <span style={{ color: 'var(--fifa-pitch-green)', fontWeight: 900, fontSize: '1.1rem' }}>{(stats.recovery || 0).toFixed(1)}%</span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        background: 'rgba(5, 150, 105, 0.15)',
                        border: '1px solid rgba(5, 150, 105, 0.4)',
                        color: 'var(--fifa-pitch-green)',
                        padding: '0.05rem 0.3rem',
                        borderRadius: '3px',
                        whiteSpace: 'nowrap'
                      }}>
                        {Math.min((stats.recovery || 0) * 0.4, 40).toFixed(1)} PTS
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Role Label badge */}
              <div style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                color: '#0f172a',
                letterSpacing: '0.8px',
                background: 'linear-gradient(135deg, #facc15, #dfb72c)',
                padding: '2px 8px',
                borderRadius: '3px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                marginTop: '4px'
              }}>
                {role}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    );
  }

  // 2. STANDARD SQUARE COMPACT CARD AS FALLBACK
  const cardSize = { width: '200px', height: '200px' };

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="fifa-card-wrapper"
      style={cardSize}
    >
      <div className="fifa-card">
        {/* Card Shine Reflection */}
        <div className="fifa-card-shine"></div>
        
        {/* Minimal High-Tech Gold Corner SVG Frame & Stadium Background */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 4
          }}
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Football Stadium Watermark Background (Opacity 0.1) */}
          <g opacity="0.1">
            {/* Left and Right volumetric stadium floodlight beams */}
            <polygon points="5,5 75,5 100,100 5,75" fill="url(#lightRayL)" />
            <polygon points="195,5 125,5 100,100 195,75" fill="url(#lightRayR)" />
            
            {/* Football pitch line markings at the bottom */}
            <path d="M60 195 A 40 40 0 0 1 140 195" stroke="#ffffff" strokeWidth="0.75" />
            <path d="M75 195 A 25 25 0 0 1 125 195" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 2" />
            {/* Goal Line */}
            <line x1="5" y1="195" x2="195" y2="195" stroke="#ffffff" strokeWidth="1" />
            {/* Penalty Spot */}
            <circle cx="100" cy="172" r="1.2" fill="#ffffff" />
          </g>

          {/* Gold Inset Border & Corner Brackets */}
          <rect x="5" y="5" width="190" height="190" rx="8" stroke="url(#goldGradSquare)" strokeWidth="0.75" strokeOpacity="0.4" />
          <path d="M5 20 L5 12 A 8 8 0 0 1 12 5 L20 5" stroke="url(#goldGradSquare)" strokeWidth="1.5" strokeOpacity="0.85" />
          <path d="M180 5 L188 5 A 8 8 0 0 1 195 12 L195 20" stroke="url(#goldGradSquare)" strokeWidth="1.5" strokeOpacity="0.85" />
          <path d="M195 180 L195 188 A 8 8 0 0 1 188 195 L180 195" stroke="url(#goldGradSquare)" strokeWidth="1.5" strokeOpacity="0.85" />
          <path d="M20 195 L12 195 A 8 8 0 0 1 5 188 L5 180" stroke="url(#goldGradSquare)" strokeWidth="1.5" strokeOpacity="0.85" />
          
          <defs>
            <linearGradient id="goldGradSquare" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#facc15" />
              <stop offset="65%" stopColor="#b8911f" />
              <stop offset="100%" stopColor="#dfb72c" />
            </linearGradient>
            <linearGradient id="lightRayL" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfb72c" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lightRayR" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#dfb72c" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Main Content Layout */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          padding: '0.6rem 0.7rem 0.5rem 0.7rem', 
          justifyContent: 'space-between' 
        }}>
          
          {/* Header Row */}
          <div className="flex items-center justify-between" style={{ height: '24px' }}>
            <div className="flex items-baseline" style={{ gap: '0.2rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--fifa-gold)', lineHeight: 1 }}>
                {isSales ? (stats.foton || 0) + (stats.mahindra || 0) + (stats.resale || 0) : Math.round(stats.recovery || 0)}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>
                {isSales ? "U" : "%"}
              </span>
            </div>
            <CountryFlag countryName={territoryName} />
          </div>
          
          {/* Avatar Profile Section */}
          <div className="flex justify-center items-center" style={{ margin: '0.1rem 0' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(223, 183, 44, 0.15) 0%, transparent 80%)',
              border: '1px solid rgba(223, 183, 44, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)',
              overflow: 'hidden'
            }}>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={playerName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const svg = parent.querySelector('svg');
                      if (svg) svg.style.display = 'block';
                    }
                  }}
                />
              ) : null}
              <svg
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  color: 'rgba(250, 204, 21, 0.5)',
                  display: imageSrc ? 'none' : 'block'
                }}
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                <path d="M50 15c-8.3 0-15 6.7-15 15s6.7 15 15 15 15-6.7 15-15-6.7-15-15-15zm-22.5 45c-4.1 0-7.5 3.4-7.5 7.5v12.5c0 2.8 2.2 5 5 5h50c2.8 0 5-2.2 5-5V67.5c0-4.1-3.4-7.5-7.5-7.5H27.5z" />
              </svg>
              {/* Micro active green status dot */}
              <div style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--fifa-pitch-green)',
                boxShadow: '0 0 6px var(--fifa-pitch-green)',
                border: '1px solid #000',
                zIndex: 3
              }}></div>
            </div>
          </div>
          
          {/* Identity Section */}
          <div className="text-center" style={{ padding: '0 0.15rem' }}>
            <div style={{ 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              color: '#ffffff', 
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {playerName}
            </div>
            <div style={{ 
              fontSize: '0.6rem', 
              fontWeight: 700, 
              color: 'var(--fifa-gold)', 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginTop: '0.05rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {territoryName}
            </div>
            
            {/* Elegant Micro-Sponsorship Watermark */}
            <div style={{
              fontSize: '0.42rem',
              fontWeight: 900,
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginTop: '0.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem'
            }}>
              <span>ACI MOTORS</span>
              <span style={{ color: 'var(--fifa-gold)', opacity: 0.6 }}>|</span>
              <span>FOTON</span>
              <span style={{ color: 'var(--fifa-gold)', opacity: 0.6 }}>|</span>
              <span>MAHINDRA</span>
            </div>
          </div>
          
          {/* Stats & Badge Section */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '0.15rem', 
            borderTop: '1px solid rgba(255,255,255,0.06)', 
            paddingTop: '0.25rem' 
          }}>
            
            {/* Stats row */}
            <div className="flex justify-center items-center" style={{ gap: '0.5rem' }}>
              {isSales ? (
                <>
                  <div style={{ display: 'flex', gap: '0.15rem', fontSize: '0.65rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>FTN</span>
                    <span style={{ color: '#fff', fontWeight: 800 }}>{stats.foton || 0}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>|</span>
                  <div style={{ display: 'flex', gap: '0.15rem', fontSize: '0.65rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>MHD</span>
                    <span style={{ color: '#fff', fontWeight: 800 }}>{stats.mahindra || 0}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.65rem' }}>|</span>
                  <div style={{ display: 'flex', gap: '0.15rem', fontSize: '0.65rem' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 500 }}>RSL</span>
                    <span style={{ color: '#fff', fontWeight: 800 }}>{stats.resale || 0}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '0.2rem', fontSize: '0.65rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>RECOVERY</span>
                  <span style={{ color: 'var(--fifa-pitch-green)', fontWeight: 900 }}>{(stats.recovery || 0).toFixed(1)}%</span>
                </div>
              )}
            </div>
            
            {/* Minimal Role Plaque */}
            <div style={{
              fontSize: '0.55rem',
              fontWeight: 850,
              textTransform: 'uppercase',
              color: '#0f172a',
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #facc15, #dfb72c)',
              padding: '0.05rem 0.4rem',
              borderRadius: '2px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              lineHeight: 1.2
            }}>
              {role}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
