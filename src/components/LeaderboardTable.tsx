"use client";

import { motion } from "framer-motion";
import CountryFlag from "./CountryFlag";

interface TeamData {
  id: string;
  name: string;
  division: string;
  played: number;
  newSalesScore: number;
  resaleScore: number;
  mahindraBonus: number;
  recoveryScore: number;
  totalScore: number;
  fotonUnits: number;
  mahindraUnits: number;
  resaleUnits: number;
  avgRecoveryPercentage: number;
}

interface LeaderboardTableProps {
  division: string;
  teams: TeamData[];
  color: string;
}

export default function LeaderboardTable({ division, teams, color }: LeaderboardTableProps) {
  // Determine if a team is at risk of relegation or eligible for promotion
  const getRowClass = (index: number) => {
    let classes = "";
    if (index === 0) classes += " rank-1";
    if (index === 1) classes += " rank-2";
    if (index === 2) classes += " rank-3";
    
    // Bottom 2 of Elite, Champions, Warriors = Relegation Risk
    if (division !== "Challengers" && index >= teams.length - 2 && teams.length > 3) {
      classes += " relegation";
    }
    return classes;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{ overflow: "visible" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold flex items-center" style={{ 
          gap: '0.75rem', 
          color,
          letterSpacing: '-0.5px',
          textShadow: `0 2px 10px ${color}33`
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`
          }}></span>
          {division} Division
        </h2>
        <span className="div-badge" style={{ 
          background: `linear-gradient(135deg, ${color}22, transparent)`, 
          border: `1px solid ${color}44`,
          color: color,
          padding: '0.5rem 1rem',
          fontSize: '0.85rem'
        }}>
          {teams.length} Teams
        </span>
      </div>

      <div className="fifa-table-container overflow-x-auto w-full" style={{ overflowY: "hidden" }}>
        <table className="fifa-table" style={{ width: '100%' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ width: '35px' }}>RK</th>
              <th>TERRITORY</th>
              <th className="text-center" title="New Sales Score (Foton + Mahindra) - Max 20 PTS" style={{ width: '75px', color: 'var(--fifa-burgundy-light)' }}>SALES (20)</th>
              <th className="text-center" title="Resale Units Score - Max 30 PTS" style={{ width: '75px', color: 'var(--fifa-burgundy-light)' }}>RESALE (30)</th>
              <th className="text-center" title="Bonus: Mahindra (+2/Mhd) & Extra Resale (+2/Unit > 6) - Max 10 PTS" style={{ width: '75px', color: 'var(--fifa-gold-dark)' }}>BONUS (10)</th>
              <th className="text-center" title="EMI Recovery Ach% Score - Max 40 PTS" style={{ width: '75px', color: 'var(--fifa-pitch-green)' }}>RECOV (40)</th>
              <th className="text-center" style={{ color: 'var(--fifa-burgundy-light)', fontWeight: 800, width: '65px' }} title="Total Points Score (Max 100 PTS)">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-secondary">
                  No data uploaded yet for this division.
                </td>
              </tr>
            ) : (
              teams.map((team, index) => {
                return (
                  <motion.tr 
                    key={team.id} 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ 
                      scale: 1.01, 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      zIndex: 10,
                      position: 'relative'
                    }}
                    transition={{ delay: index * 0.04 }}
                    className={getRowClass(index)}
                  >
                    {/* Rank Column */}
                    <td data-label="Rank">
                      <span className="rank-number">
                        {index + 1}
                      </span>
                    </td>
                    
                    {/* Territory Flag & Name */}
                    <td data-label="Territory" style={{ fontWeight: 600 }}>
                      <div className="territory-cell-wrapper" style={{ gap: '0.75rem' }}>
                        <CountryFlag countryName={team.name} />
                        <div className="flex items-center" style={{ gap: '0.25rem' }}>
                          <span className="team-name">{team.name}</span>
                          {division === "Elite" && index === 0 && (
                            <span style={{ fontSize: '1.1rem', cursor: 'help' }} title="Tournament Leader">🏆</span>
                          )}
                          {division !== "Elite" && index === 0 && (
                            <span style={{ fontSize: '0.9rem', color: '#10b981', cursor: 'help' }} title="Promotion Zone">▲</span>
                          )}
                          {division !== "Challengers" && index >= teams.length - 2 && teams.length > 3 && (
                            <span style={{ fontSize: '0.9rem', color: '#ef4444', cursor: 'help' }} title="Relegation Zone">▼</span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {/* New Sales Score (max 20) */}
                    <td data-label="Sales" className="text-center" style={{ verticalAlign: 'middle' }}>
                      <div className="flex flex-col items-center justify-center">
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{team.newSalesScore.toFixed(1)} <span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.7 }}>PTS</span></span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {team.fotonUnits}F / {team.mahindraUnits}M
                        </span>
                      </div>
                    </td>
                    
                    {/* Resales Score (max 30) */}
                    <td data-label="Resale" className="text-center" style={{ verticalAlign: 'middle' }}>
                      <div className="flex flex-col items-center justify-center">
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{team.resaleScore.toFixed(1)} <span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.7 }}>PTS</span></span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{team.resaleUnits} units</span>
                      </div>
                    </td>
                    
                    {/* Bonus Score (max 10) */}
                    <td data-label="Bonus" className="text-center" style={{ verticalAlign: 'middle' }}>
                      <div className="flex flex-col items-center justify-center">
                        <span style={{ 
                          fontWeight: 700, 
                          fontSize: '0.9rem',
                          color: team.mahindraBonus > 0 ? 'var(--fifa-gold-dark)' : 'var(--text-secondary)' 
                        }}>
                          +{team.mahindraBonus.toFixed(1)} <span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.7 }}>PTS</span>
                        </span>
                        {(team.mahindraUnits > 0 || team.resaleUnits > 6) ? (
                          <div className="flex gap-1 items-center">
                            {team.mahindraUnits > 0 && <span style={{ fontSize: '0.6rem', color: 'var(--fifa-gold-dark)', fontWeight: 600 }}>{team.mahindraUnits} Mhd</span>}
                            {team.resaleUnits > 6 && <span style={{ fontSize: '0.6rem', color: 'var(--fifa-gold-dark)', fontWeight: 600 }}>{team.resaleUnits - 6} Res</span>}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.5 }}>-</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Recovery Score (max 40) */}
                    <td data-label="Recovery" className="text-center" style={{ verticalAlign: 'middle' }}>
                      <div className="flex flex-col items-center justify-center">
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--fifa-pitch-green)' }}>{team.recoveryScore.toFixed(1)} <span style={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.7 }}>PTS</span></span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--fifa-pitch-green)', fontWeight: 600 }}>{team.avgRecoveryPercentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    
                    {/* Total Points (max 100) */}
                    <td data-label="Total" className="text-center" style={{ verticalAlign: 'middle' }}>
                      <div className="flex flex-col items-center justify-center">
                        {/* Main Highlight: Total PTS */}
                        <span style={{ 
                          fontWeight: 900, 
                          color: index === 0 ? 'var(--fifa-gold-dark)' : '#0f172a', 
                          fontSize: '1.05rem',
                          textShadow: index === 0 ? '0 0 10px rgba(223, 183, 44, 0.4)' : 'none',
                          letterSpacing: '0.5px'
                        }}>
                          {team.totalScore.toFixed(1)} <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.9 }}>PTS</span>
                        </span>
                        
                        {/* Secondary Outcomes Details */}
                        <span style={{ 
                          fontSize: '0.68rem', 
                          color: 'var(--text-secondary)', 
                          fontWeight: 600,
                          marginTop: '0.1rem'
                        }}>
                          {team.fotonUnits + team.mahindraUnits + team.resaleUnits} U | {team.avgRecoveryPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Visual Table Legend */}
      <div className="flex justify-between items-center mt-4" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '0.75rem' }}>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <span><strong>SALES:</strong> Foton + Mahindra (Max 20)</span>
          <span><strong>RESALE:</strong> Resale Units (Max 30)</span>
          <span><strong>BONUS:</strong> Mahindra (+2/Mhd) + Resale (+2/Unit &gt; 6) - Max 10</span>
          <span><strong>RECOV:</strong> EMI Ach% Score (Max 40)</span>
        </div>
        <div>
          {division !== "Challengers" && <span style={{ marginRight: '0.75rem' }}><span style={{ color: '#ef4444' }}>■</span> Relegation</span>}
          {division !== "Elite" && <span><span style={{ color: '#10b981' }}>■</span> Promotion</span>}
        </div>
      </div>
    </motion.div>
  );
}
