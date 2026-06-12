"use client";

import { useMemo } from "react";

// Curated list of premium, harmonious soccer club color palettes
const PALETTES = [
  { primary: "#7c1224", secondary: "#dfb72c", text: "#ffffff" }, // Burgundy & Gold (ACI CVWC theme)
  { primary: "#0f172a", secondary: "#38bdf8", text: "#0f172a" }, // Royal Navy & Sky Blue
  { primary: "#059669", secondary: "#facc15", text: "#1e293b" }, // Pitch Green & Gold
  { primary: "#b91c1c", secondary: "#cbd5e1", text: "#1e293b" }, // Crimson & Silver
  { primary: "#1e293b", secondary: "#f97316", text: "#ffffff" }, // Deep Charcoal & Orange
  { primary: "#0f766e", secondary: "#dfb72c", text: "#1e293b" }, // Teal & Bronze
  { primary: "#581c87", secondary: "#facc15", text: "#581c87" }, // Purple & Gold
  { primary: "#14532d", secondary: "#ffffff", text: "#14532d" }, // Forest Green & White
  { primary: "#4f46e5", secondary: "#f43f5e", text: "#ffffff" }, // Indigo & Rose
  { primary: "#b45309", secondary: "#fde047", text: "#1e293b" }, // Amber & Yellow
  { primary: "#0369a1", secondary: "#f1f5f9", text: "#0369a1" }  // Sky Blue & Ice White
];

// Patterns for dynamic flag designs
const PATTERNS = ["stripes", "diagonal", "horizontal", "checkers", "solid"];

// Stable hash function to guarantee consistent designs for each territory name
function getStableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Extractor to generate clean 2-character initials
function getTerritoryInitials(name: string): string {
  const cleanName = name.replace(/['.]/g, "").trim();
  const words = cleanName.split(/[\s-]+/);
  
  if (words.length >= 2) {
    const w1 = words[0][0] || "";
    const w2 = words[1][0] || "";
    return (w1 + w2).toUpperCase();
  }
  
  if (cleanName.length >= 3) {
    // e.g. Savar -> SV, Sylhet -> SY, Bogura -> BG
    return (cleanName[0] + (cleanName[2] || cleanName[1] || "")).toUpperCase();
  }
  
  return cleanName.slice(0, 2).toUpperCase();
}

export default function CountryFlag({ 
  countryName, 
  className = "" 
}: { 
  countryName: string; 
  className?: string; 
}) {
  const design = useMemo(() => {
    const hash = getStableHash(countryName);
    const palette = PALETTES[hash % PALETTES.length];
    const pattern = PATTERNS[(hash + 3) % PATTERNS.length];
    const initials = getTerritoryInitials(countryName);
    
    return { palette, pattern, initials };
  }, [countryName]);

  const { palette, pattern, initials } = design;

  return (
    <div 
      className={`country-flag ${className}`}
      style={{
        width: "24px",
        height: "18px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
        display: "inline-block",
        verticalAlign: "middle",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.2s ease",
        background: palette.primary,
        flexShrink: 0
      }}
      title={`${countryName} Squad Crest`}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 18" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Flag Pattern Base */}
        {pattern === "diagonal" && (
          <>
            <path d="M0 0 L24 0 L24 18 Z" fill={palette.secondary} />
            <path d="M0 0 L24 18 L0 18 Z" fill={palette.primary} />
          </>
        )}
        
        {pattern === "horizontal" && (
          <>
            <rect x="0" y="0" width="24" height="9" fill={palette.primary} />
            <rect x="0" y="9" width="24" height="9" fill={palette.secondary} />
          </>
        )}
        
        {pattern === "stripes" && (
          <>
            <rect x="0" y="0" width="8" height="18" fill={palette.primary} />
            <rect x="8" y="0" width="8" height="18" fill={palette.secondary} />
            <rect x="16" y="0" width="8" height="18" fill={palette.primary} />
          </>
        )}
        
        {pattern === "checkers" && (
          <>
            <rect x="0" y="0" width="12" height="9" fill={palette.primary} />
            <rect x="12" y="0" width="12" height="9" fill={palette.secondary} />
            <rect x="0" y="9" width="12" height="9" fill={palette.secondary} />
            <rect x="12" y="9" width="12" height="9" fill={palette.primary} />
          </>
        )}
        
        {pattern === "solid" && (
          <>
            <rect x="0" y="0" width="24" height="18" fill={palette.primary} />
            {/* Elegant vertical pinstripe split */}
            <line x1="12" y1="0" x2="12" y2="18" stroke={palette.secondary} strokeWidth="1.5" />
          </>
        )}

        {/* Diagonal Glossy Sheen Overlay */}
        <path d="M0 0 L24 0 L0 18 Z" fill="rgba(255, 255, 255, 0.15)" />

        {/* Central Circular Badge Plaque */}
        <circle 
          cx="12" 
          cy="9" 
          r="6.5" 
          fill={palette.secondary} 
          stroke={palette.primary} 
          strokeWidth="0.5" 
          style={{ filter: "drop-shadow(0px 1px 1.5px rgba(0,0,0,0.3))" }}
        />

        {/* Initial Letters Text */}
        <text 
          x="12" 
          y="11.2" 
          fontSize="6.2" 
          fontWeight="900" 
          fill={palette.text} 
          textAnchor="middle" 
          fontFamily="monospace"
          letterSpacing="-0.2"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
