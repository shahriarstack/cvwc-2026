"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { getTerritoryTeam } from "@/lib/mvps";

export default function ScorecardGenerator() {
  const [loading, setLoading] = useState(false);
  const [scorecardData, setScorecardData] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const fetchAndCapture = async () => {
    setLoading(true);
    try {
      // 1. Fetch data
      const [res, spotlightRes] = await Promise.all([
        fetch("/api/leaderboard"),
        fetch("/api/admin/upload-images")
      ]);
      if (!res.ok) throw new Error("Failed to fetch leaderboard data");
      const { territories } = await res.json();

      let spotlightData = { strikerName: '', goalkeeperName: '', strikerImage: '', goalkeeperImage: '', goalkeeper2Name: '', goalkeeper2Image: '' };
      if (spotlightRes.ok) {
        spotlightData = await spotlightRes.json();
      }

      // 2. Process data exactly like Dashboard
      const data = territories.map((t: any) => {
        const played = t.performances.length;
        const sortedPerformances = [...t.performances].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const latestPerf = sortedPerformances[0];
        const fotonUnits = latestPerf ? latestPerf.newSalesFoton : 0;
        const mahindraUnits = latestPerf ? latestPerf.newSalesMahindra : 0;
        const resaleUnits = latestPerf ? latestPerf.resale : 0;
        
        const newSalesScore = Math.min((fotonUnits + mahindraUnits) * 3, 20);
        const resaleScore = Math.min(resaleUnits * 5, 30);
        const extraResaleUnits = Math.max(0, resaleUnits - 6);
        const mahindraBonus = Math.min((mahindraUnits * 2) + (extraResaleUnits * 2), 10);
        const recoveryScore = latestPerf ? latestPerf.recoveryPerformanceScore : 0;
        
        const totalScore = newSalesScore + resaleScore + mahindraBonus + recoveryScore;
        const avgRecoveryPercentage = latestPerf ? (recoveryScore / 0.4) : 0;

        return {
          id: t.id,
          name: t.name,
          played,
          fotonUnits,
          mahindraUnits,
          resaleUnits,
          newSalesScore,
          resaleScore,
          mahindraBonus,
          recoveryScore,
          avgRecoveryPercentage,
          totalScore,
        };
      });

      const processedLeaderboard = data.sort((a: any, b: any) => b.totalScore - a.totalScore);

      const dividedLeaderboard = processedLeaderboard.map((team: any, index: number) => {
        let division = "";
        if (index < 11) division = "Elite";
        else if (index < 22) division = "Champions";
        else if (index < 33) division = "Warriors";
        else division = "Challengers";
        return { ...team, division, rank: index + 1 };
      });

      setScorecardData({
        leaderboard: dividedLeaderboard,
        spotlight: spotlightData
      });

      // Wait a moment for React to render the DOM
      setTimeout(async () => {
        if (captureRef.current) {
          const canvas = await html2canvas(captureRef.current, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: "#0f172a", // Match page background
          });
          
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `CVWC_Scorecard_${new Date().toISOString().split('T')[0]}.png`;
          link.click();
        }
        setScorecardData(null); // Cleanup
        setLoading(false);
      }, 500);

    } catch (err) {
      console.error(err);
      alert("Failed to generate scorecard image.");
      setLoading(false);
    }
  };

  return (
    <div className="card mt-8 mb-4" style={{ padding: '1.5rem', background: '#0a0d18', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative BG */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at right top, rgba(223,183,44,0.1) 0%, transparent 40%)',
        zIndex: 0
      }}></div>

      <div className="flex flex-col" style={{ position: 'relative', zIndex: 10, alignItems: 'center' }}>
        <h2 className="text-xl font-bold" style={{ color: '#fff', marginBottom: '0.5rem' }}>Global Official Scorecard Generator</h2>
        <p className="text-secondary text-center" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
          Generate and download a high-resolution poster containing the overall Top Team and all 4 division standings (all 44 territories).
        </p>

        <button
          onClick={fetchAndCapture}
          disabled={loading}
          style={{
            background: loading ? '#475569' : 'linear-gradient(135deg, var(--fifa-burgundy), var(--fifa-burgundy-dark))',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(124,18,36,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {loading ? 'Generating Canvas...' : 'Download Official Scorecard Image'}
        </button>
      </div>

      {/* Hidden layout for html2canvas */}
      {scorecardData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div 
            ref={captureRef}
            style={{
              width: '1200px', // Fixed poster width
              background: 'linear-gradient(180deg, #0f172a 0%, #050a12 100%)',
              color: '#fff',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Watermark Section */}
            {(() => {
              const topTeam = scorecardData.leaderboard[0];
              const members = [...getTerritoryTeam(topTeam.name)];
              
              const hasGK2 = scorecardData.spotlight.goalkeeper2Name || scorecardData.spotlight.goalkeeper2Image;
              if (hasGK2) {
                members.push({
                  name: scorecardData.spotlight.goalkeeper2Name || "Recovery Officer",
                  role: "Recovery Goalkeeper",
                  avatarCode: "recovery"
                });
              }

              let goalkeepersProcessed = 0;
              const performers = members.map((m) => {
                let imageSrc = "";
                let playerName = m.name;
                
                if (m.avatarCode === "sales") {
                  if (scorecardData.spotlight.strikerImage) imageSrc = scorecardData.spotlight.strikerImage;
                  if (scorecardData.spotlight.strikerName) playerName = scorecardData.spotlight.strikerName;
                } else if (m.avatarCode === "recovery") {
                  goalkeepersProcessed++;
                  if (goalkeepersProcessed === 1) {
                    if (scorecardData.spotlight.goalkeeperImage) imageSrc = scorecardData.spotlight.goalkeeperImage;
                    if (scorecardData.spotlight.goalkeeperName) playerName = scorecardData.spotlight.goalkeeperName;
                  } else {
                    if (scorecardData.spotlight.goalkeeper2Image) imageSrc = scorecardData.spotlight.goalkeeper2Image;
                    if (scorecardData.spotlight.goalkeeper2Name) playerName = scorecardData.spotlight.goalkeeper2Name;
                  }
                }
                return { ...m, name: playerName, imageSrc };
              }).filter(p => p.imageSrc);

              if (performers.length === 0) return null;

              return (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 0,
                  display: 'flex',
                  opacity: 0.15, // Subtle watermark effect
                  mixBlendMode: 'luminosity'
                }}>
                  {performers.map((perf, idx) => (
                    <div key={idx} style={{ flex: 1, position: 'relative', height: '100%' }}>
                       <img src={perf.imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                       {/* Fade out gradient at the bottom so it blends with the dark background */}
                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,0.5) 50%, #050a12 100%)' }}></div>
                       {/* Subtle name label integrated into the watermark */}
                       <div style={{ 
                         position: 'absolute', 
                         bottom: '15%', 
                         left: '50%', 
                         transform: 'translateX(-50%)', 
                         fontSize: '3rem', 
                         fontWeight: 900, 
                         textTransform: 'uppercase', 
                         color: '#fff', 
                         whiteSpace: 'nowrap', 
                         opacity: 0.2,
                         letterSpacing: '5px'
                       }}>
                         {perf.name}
                       </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Foreground Content */}
            <div style={{ position: 'relative', zIndex: 10, padding: '50px' }}>
              {/* Header Section */}
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, margin: 0, color: 'var(--fifa-gold)', textTransform: 'uppercase', textShadow: '0 4px 20px rgba(223, 183, 44, 0.4)' }}>
                  CV World Cup 2026
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#e2e8f0', margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 600 }}>
                  Official Global Standings • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Top Highlight Section */}
              {(() => {
                const topTeam = scorecardData.leaderboard[0];
                return (
                  <div style={{ 
                    maxWidth: '700px',
                    margin: '0 auto 60px auto',
                    background: 'linear-gradient(135deg, rgba(124, 18, 36, 0.3) 0%, rgba(223, 183, 44, 0.15) 100%)',
                    border: '1px solid rgba(223, 183, 44, 0.4)',
                    borderRadius: '24px',
                    padding: '35px',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(12px)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
                      <span style={{ height: '2px', width: '50px', background: 'var(--fifa-gold)', opacity: 0.6 }}></span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fifa-gold)', textTransform: 'uppercase', letterSpacing: '3px' }}>
                        Overall Current Top Team
                      </span>
                      <span style={{ height: '2px', width: '50px', background: 'var(--fifa-gold)', opacity: 0.6 }}></span>
                    </div>
                    
                    <h2 style={{ fontSize: '4rem', fontWeight: 900, margin: '20px 0', color: '#fff', textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,0.8)', letterSpacing: '1px' }}>
                      {topTeam.name}
                    </h2>
                    
                    <div style={{ 
                      display: 'inline-block', 
                      background: 'linear-gradient(90deg, var(--fifa-burgundy), #a3162f)', 
                      padding: '12px 40px', 
                      borderRadius: '40px', 
                      fontSize: '1.8rem', 
                      fontWeight: 900,
                      boxShadow: '0 8px 25px rgba(124, 18, 36, 0.4)',
                      border: '1px solid rgba(255,255,255,0.15)'
                    }}>
                      {topTeam.totalScore.toFixed(1)} PTS
                    </div>
                  </div>
                );
              })()}

              {/* Division Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {["Elite", "Champions", "Warriors", "Challengers"].map(division => {
                  const teams = scorecardData.leaderboard.filter((t: any) => t.division === division);
                  const colors: any = {
                    "Elite": "#facc15",
                    "Champions": "#cbd5e1",
                    "Warriors": "#f59e0b",
                    "Challengers": "#38bdf8"
                  };
                  
                  return (
                    <div key={division} style={{ 
                      background: 'rgba(15, 23, 42, 0.6)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '16px',
                      padding: '25px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h3 style={{ 
                        fontSize: '1.6rem', 
                        margin: '0 0 20px 0', 
                        color: colors[division], 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        borderBottom: `2px solid ${colors[division]}`,
                        paddingBottom: '12px',
                        letterSpacing: '1px'
                      }}>
                        {division} Division
                      </h3>
                      
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                          <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '10px 6px', width: '45px', fontWeight: 700 }}>RK</th>
                            <th style={{ padding: '10px 6px', fontWeight: 700 }}>Territory</th>
                            <th style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 700 }}>Sales</th>
                            <th style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 700 }}>Resale</th>
                            <th style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 700 }}>Bonus</th>
                            <th style={{ padding: '10px 6px', textAlign: 'center', fontWeight: 700 }}>Recov</th>
                            <th style={{ padding: '10px 6px', textAlign: 'right', color: '#fff', fontWeight: 800 }}>TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teams.map((team: any) => (
                            <tr key={team.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td style={{ padding: '10px 6px', fontWeight: 700, color: '#94a3b8' }}>#{team.rank}</td>
                              <td style={{ padding: '10px 6px', fontWeight: 600, color: '#fff' }}>{team.name}</td>
                              <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{team.newSalesScore.toFixed(0)}</span>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{team.fotonUnits + team.mahindraUnits} units</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{team.resaleScore.toFixed(0)}</span>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{team.resaleUnits} units</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{team.mahindraBonus.toFixed(0)}</span>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{team.mahindraUnits}u Mah</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{team.recoveryScore.toFixed(1)}</span>
                                  <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{team.avgRecoveryPercentage.toFixed(0)}%</span>
                                </div>
                              </td>
                              <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 800, color: colors[division], fontSize: '1.1rem' }}>
                                {team.totalScore.toFixed(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '30px', color: '#475569', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
              PRODUCED BY CVWC 2026 ADMIN SYSTEM • ACI MOTORS LTD.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
