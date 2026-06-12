"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function ScorecardGenerator() {
  const [loading, setLoading] = useState(false);
  const [scorecardData, setScorecardData] = useState<any>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const fetchAndCapture = async () => {
    setLoading(true);
    try {
      // 1. Fetch data
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch data");
      const { territories } = await res.json();

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

      setScorecardData(dividedLeaderboard);

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
              padding: '40px',
              color: '#fff',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, color: 'var(--fifa-gold)', textTransform: 'uppercase' }}>
                CV World Cup 2026
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', margin: '10px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Official Global Standings • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Top Performing Team Highlight */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(223, 183, 44, 0.15) 0%, rgba(124, 18, 36, 0.15) 100%)',
              border: '1px solid rgba(223, 183, 44, 0.4)',
              borderRadius: '16px',
              padding: '25px',
              textAlign: 'center',
              marginBottom: '40px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--fifa-gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Overall Current Leader
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '5px 0', color: '#fff' }}>
                {scorecardData[0].name}
              </h2>
              <div style={{ display: 'inline-block', background: 'var(--fifa-burgundy)', padding: '5px 15px', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 800 }}>
                {scorecardData[0].totalScore.toFixed(1)} PTS
              </div>
            </div>

            {/* Division Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {["Elite", "Champions", "Warriors", "Challengers"].map(division => {
                const teams = scorecardData.filter((t: any) => t.division === division);
                const colors: any = {
                  "Elite": "#facc15",
                  "Champions": "#94a3b8",
                  "Warriors": "#d97706",
                  "Challengers": "#0ea5e9"
                };
                
                return (
                  <div key={division} style={{ 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      margin: '0 0 15px 0', 
                      color: colors[division], 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      borderBottom: `2px solid ${colors[division]}`,
                      paddingBottom: '10px'
                    }}>
                      {division} Division
                    </h3>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ color: '#64748b', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th style={{ padding: '8px 4px', width: '40px' }}>RK</th>
                          <th style={{ padding: '8px 4px' }}>Territory</th>
                          <th style={{ padding: '8px 4px', textAlign: 'center' }}>Sales</th>
                          <th style={{ padding: '8px 4px', textAlign: 'center' }}>Resale</th>
                          <th style={{ padding: '8px 4px', textAlign: 'center' }}>Bonus</th>
                          <th style={{ padding: '8px 4px', textAlign: 'center' }}>Recov</th>
                          <th style={{ padding: '8px 4px', textAlign: 'right', color: '#fff' }}>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teams.map((team: any) => (
                          <tr key={team.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '8px 4px', fontWeight: 700, color: '#94a3b8' }}>#{team.rank}</td>
                            <td style={{ padding: '8px 4px', fontWeight: 600, color: '#fff' }}>{team.name}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', color: '#94a3b8' }}>{team.newSalesScore.toFixed(0)}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', color: '#94a3b8' }}>{team.resaleScore.toFixed(0)}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', color: '#94a3b8' }}>{team.mahindraBonus.toFixed(0)}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', color: '#94a3b8' }}>{team.recoveryScore.toFixed(1)}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: 800, color: colors[division] }}>
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
            
            <div style={{ textAlign: 'center', marginTop: '30px', color: '#475569', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>
              PRODUCED BY CVWC 2026 ADMIN SYSTEM • ACI MOTORS LTD.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
