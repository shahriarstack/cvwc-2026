"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import CountryFlag from "./CountryFlag";

interface PerformanceData {
  salesPerformanceScore: number;
  recoveryPerformanceScore: number;
  totalDailyScore: number;
}

interface TerritoryWithPerformances {
  id: string;
  name: string;
  division: string;
  performances: PerformanceData[];
}

interface FixtureCenterProps {
  initialTerritories: TerritoryWithPerformances[];
}

export default function FixtureCenter({ initialTerritories }: FixtureCenterProps) {
  // Aggregate sales & total scores to use as simulator input
  const aggregatedTeams = useMemo(() => {
    return initialTerritories.map((t) => {
      const played = t.performances.length;
      const totalSales = t.performances.reduce((acc, curr) => acc + curr.salesPerformanceScore, 0);
      const totalRecovery = t.performances.reduce((acc, curr) => acc + curr.recoveryPerformanceScore, 0);
      const totalScore = t.performances.reduce((acc, curr) => acc + curr.totalDailyScore, 0);
      
      return {
        id: t.id,
        name: t.name,
        division: t.division,
        played,
        avgSales: played > 0 ? totalSales / played : 0,
        avgRecovery: played > 0 ? totalRecovery / played : 0,
        totalScore,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }, [initialTerritories]);

  // Generate 6 classic FIFA matchups using the real-time sorted territories
  const fixtures = useMemo(() => {
    if (aggregatedTeams.length < 12) return [];

    const pairings = [
      { t1Idx: 0, t2Idx: 1, division: "Elite", stadium: "Lusail Iconic Stadium", time: "FT" }, // #1 vs #2
      { t1Idx: 2, t2Idx: 3, division: "Elite", stadium: "Maracanã Stadium", time: "FT" }, // #3 vs #4
      { t1Idx: 11, t2Idx: 12, division: "Champions", stadium: "Wembley Stadium", time: "FT" },
      { t1Idx: 13, t2Idx: 14, division: "Champions", stadium: "Santiago Bernabéu", time: "FT" },
      { t1Idx: 22, t2Idx: 23, division: "Warriors", stadium: "Allianz Arena", time: "FT" },
      { t1Idx: 33, t2Idx: 34, division: "Challengers", stadium: "Stade de France", time: "FT" }
    ];

    return pairings.map((p, idx) => {
      const teamA = aggregatedTeams[p.t1Idx];
      const teamB = aggregatedTeams[p.t2Idx];
      
      if (!teamA || !teamB) return null;

      // Simulate a realistic soccer score based on their Sales & Recovery performances!
      const rawGoalA = (teamA.avgSales * 0.15) - (teamB.avgRecovery * 0.05) + Math.random() * 1.5;
      const rawGoalB = (teamB.avgSales * 0.15) - (teamA.avgRecovery * 0.05) + Math.random() * 1.5;

      const goalsA = Math.max(Math.floor(rawGoalA), 0);
      const goalsB = Math.max(Math.floor(rawGoalB), 0);

      // Determine match narrative
      let highlight = "Intense midfield battle!";
      if (goalsA > goalsB) {
        highlight = `${teamA.name} dominated the sales field!`;
      } else if (goalsB > goalsA) {
        highlight = `${teamB.name} clinched a tactical victory!`;
      } else if (goalsA > 0) {
        highlight = "A thrilling high-scoring draw!";
      }

      // Calculate sequential daily dates starting precisely from June 1, 2026
      const matchDate = new Date(2026, 5, 1); // 5 represents June (0-indexed)
      matchDate.setDate(matchDate.getDate() + idx);
      const formattedDate = matchDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      return {
        id: `match-${idx}`,
        matchNumber: idx + 1,
        division: p.division,
        stadium: p.stadium,
        status: p.time,
        teamA,
        teamB,
        scoreA: goalsA,
        scoreB: goalsB,
        highlight,
        date: formattedDate
      };
    }).filter(Boolean);
  }, [aggregatedTeams]);

  return (
    <main className="container mt-4 animate-fade-in" style={{ paddingBottom: "1.5rem" }}>
      {/* 1. SECTION HEADER - Compacted */}
      <div 
        className="text-center py-3 mb-4" 
        style={{ 
          background: 'radial-gradient(circle, rgba(0, 135, 90, 0.04) 0%, rgba(248, 250, 252, 0) 75%)',
          borderBottom: '1px solid rgba(124, 18, 36, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Center-aligned Logo Plaque */}
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
        
        <h1 style={{ 
          fontSize: '1.75rem', 
          fontWeight: 900,
          color: 'var(--text-primary)',
          textShadow: '0 1px 2px rgba(124, 18, 36, 0.05)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0.2rem 0 0 0'
        }}>
          Foton | Mahindra Fixtures
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.85rem', marginTop: '0.15rem' }}>
          ACI Motors Daily Matchday Calendar — Sequential battles commencing <strong style={{ color: 'var(--fifa-burgundy-light)' }}>June 1, 2026</strong>.
        </p>
      </div>

      {/* 2. MATCH FIXTURES GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {fixtures.map((match: any, index: number) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="card"
            style={{ padding: "0" }} 
          >
            {/* Broadcaster Header Banner */}
            <div style={{
              background: "linear-gradient(90deg, var(--fifa-burgundy) 0%, rgba(16, 20, 38, 0.95) 100%)",
              padding: "0.75rem 1.25rem",
              borderBottom: "1px solid rgba(223, 183, 44, 0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span className="div-badge" style={{
                backgroundColor: 
                  match.division === "Elite" ? "rgba(253, 224, 71, 0.12)" :
                  match.division === "Champions" ? "rgba(226, 232, 240, 0.12)" :
                  match.division === "Warriors" ? "rgba(246, 173, 85, 0.12)" : "rgba(252, 129, 129, 0.12)",
                color: 
                  match.division === "Elite" ? "var(--elite-color)" :
                  match.division === "Champions" ? "var(--champions-color)" :
                  match.division === "Warriors" ? "var(--warriors-color)" : "var(--challengers-color)",
                border: "1px solid currentColor",
                fontSize: "0.7rem"
              }}>
                {match.division} Division
              </span>
              
              <span style={{
                color: "var(--fifa-gold)",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.5px"
              }}>
                Matchday {match.matchNumber} • {match.status}
              </span>
            </div>

            {/* Core Scoreboard Row - Compacted */}
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "1rem 1rem 0.75rem 1rem"
            }}>
              {/* Team A */}
              <div className="flex flex-col items-center" style={{ width: "35%", textAlign: "center" }}>
                <div style={{ transform: "scale(1.0)", marginBottom: "0.4rem" }}>
                  <CountryFlag countryName={match.teamA.name} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>
                  {match.teamA.name}
                </span>
                <span className="text-secondary" style={{ fontSize: "0.7rem", marginTop: "0.1rem" }}>
                  Sales: {match.teamA.avgSales.toFixed(0)} PTS
                </span>
              </div>

              {/* Central Digital Score Box */}
              <div className="flex items-center justify-center" style={{ gap: "0.5rem", width: "30%" }}>
                <div style={{
                  background: "#080a14",
                  border: "2px solid rgba(223, 183, 44, 0.3)",
                  borderRadius: "8px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "monospace",
                  textShadow: "0 0 10px var(--fifa-gold-glow)",
                  minWidth: "40px",
                  textAlign: "center"
                }}>
                  {match.scoreA}
                </div>
                <span className="text-secondary" style={{ fontWeight: 800 }}>-</span>
                <div style={{
                  background: "#080a14",
                  border: "2px solid rgba(223, 183, 44, 0.3)",
                  borderRadius: "8px",
                  padding: "0.3rem 0.75rem",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "monospace",
                  textShadow: "0 0 10px var(--fifa-gold-glow)",
                  minWidth: "40px",
                  textAlign: "center"
                }}>
                  {match.scoreB}
                </div>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center" style={{ width: "35%", textAlign: "center" }}>
                <div style={{ transform: "scale(1.0)", marginBottom: "0.4rem" }}>
                  <CountryFlag countryName={match.teamB.name} />
                </div>
                <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>
                  {match.teamB.name}
                </span>
                <span className="text-secondary" style={{ fontSize: "0.7rem", marginTop: "0.1rem" }}>
                  Sales: {match.teamB.avgSales.toFixed(0)} PTS
                </span>
              </div>
            </div>

            {/* Stadium & Narrative Overlay */}
            <div style={{
              background: "rgba(0, 0, 0, 0.03)",
              padding: "0.4rem 1.0rem",
              borderTop: "1px solid rgba(0,0,0,0.04)",
              borderRadius: "0 0 16px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.4rem",
              fontSize: "0.7rem",
              color: "var(--text-secondary)"
            }}>
              <span className="flex items-center animate-fade-in" style={{ gap: "0.4rem" }}>
                <span>🏟️ {match.stadium}</span>
                <span style={{ color: "rgba(0,0,0,0.15)" }}>•</span>
                <span style={{ color: "var(--fifa-burgundy-light)", fontWeight: 700 }}>📅 {match.date}</span>
              </span>
              <span style={{ fontStyle: "italic", color: "var(--fifa-burgundy-light)", fontWeight: 700 }}>
                📢 {match.highlight}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
