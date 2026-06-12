"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeaderboardTable from "./LeaderboardTable";
import FifaMvpCard from "./FifaMvpCard";
import ScoringPlaybook from "./ScoringPlaybook";
import { getTerritoryTeam } from "@/lib/mvps";

interface PerformanceData {
  id: string;
  date: string;
  newSalesFoton: number;
  newSalesMahindra: number;
  resale: number;
  salesPerformanceScore: number;
  recoveryPerformanceScore: number;
  mahindraBonusScore: number;
  totalDailyScore: number;
}

interface TerritoryWithPerformances {
  id: string;
  name: string;
  division: string;
  performances: PerformanceData[];
}

interface DashboardProps {
  initialTerritories: TerritoryWithPerformances[];
  spotlightOverrides?: {
    strikerName?: string;
    goalkeeperName?: string;
    strikerImageBase64?: string;
    goalkeeperImageBase64?: string;
    goalkeeper2Name?: string;
    goalkeeper2ImageBase64?: string;
  };
}

export default function Dashboard({ initialTerritories, spotlightOverrides }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Process and aggregate data for all territories (Till-Date Cumulative)
  const processedLeaderboard = useMemo(() => {
    const data = initialTerritories.map((t) => {
      const played = t.performances.length;
      
      // Sort performances by date descending to get the latest cumulative "till date" record
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
      const combinedBonus = Math.min((mahindraUnits * 2) + (extraResaleUnits * 2), 10);
      const mahindraBonus = combinedBonus; // Kept property name same to prevent massive refactoring
      
      const recoveryScore = latestPerf ? latestPerf.recoveryPerformanceScore : 0;
      
      const totalScore = newSalesScore + resaleScore + mahindraBonus + recoveryScore;
      const avgRecoveryPercentage = latestPerf ? (recoveryScore / 0.4) : 0;

      return {
        id: t.id,
        name: t.name,
        played,
        newSalesScore,
        resaleScore,
        mahindraBonus,
        recoveryScore,
        salesScore: newSalesScore + resaleScore,
        totalScore,
        fotonUnits,
        mahindraUnits,
        resaleUnits,
        avgRecoveryPercentage,
      };
    });

    // Sort globally by totalScore
    return data.sort((a, b) => b.totalScore - a.totalScore);
  }, [initialTerritories]);

  // 2. Dynamically assign divisions based on real-time rankings (11 teams per division)
  const dividedLeaderboard = useMemo(() => {
    return processedLeaderboard.map((team, idx) => {
      let division = "Challengers";
      if (idx < 11) division = "Elite";
      else if (idx < 22) division = "Champions";
      else if (idx < 33) division = "Warriors";

      return {
        ...team,
        division,
      };
    });
  }, [processedLeaderboard]);

  // 3. Extract separate division list
  const eliteTeams = useMemo(() => dividedLeaderboard.filter((t) => t.division === "Elite"), [dividedLeaderboard]);
  const championsTeams = useMemo(() => dividedLeaderboard.filter((t) => t.division === "Champions"), [dividedLeaderboard]);
  const warriorsTeams = useMemo(() => dividedLeaderboard.filter((t) => t.division === "Warriors"), [dividedLeaderboard]);
  const challengersTeams = useMemo(() => dividedLeaderboard.filter((t) => t.division === "Challengers"), [dividedLeaderboard]);

  // 4. Calculate Tournaments MVPs (highest total Sales & Recovery scores)
  // 4. Calculate Best Team and its members dynamically
  const topTeam = useMemo(() => {
    if (dividedLeaderboard.length === 0) return null;
    return dividedLeaderboard[0];
  }, [dividedLeaderboard]);

  const topTeamMembers = useMemo(() => {
    if (!topTeam) return [];
    
    // Copy the original array to avoid mutating static data
    const members = [...getTerritoryTeam(topTeam.name)];
    
    // If the admin provided a second goalkeeper, inject them dynamically into the array
    if (spotlightOverrides?.goalkeeper2Name || spotlightOverrides?.goalkeeper2ImageBase64) {
      members.push({
        name: spotlightOverrides.goalkeeper2Name || "Recovery Officer",
        role: "Recovery Goalkeeper",
        avatarCode: "recovery"
      });
    }
    
    // Scale rating between 85 and 99 based on team's totalScore (max 100)
    const rating = 85 + (topTeam.totalScore / 100) * 14;

    // Track if we've processed the first goalkeeper so the second one gets the 2nd image
    let goalkeepersProcessed = 0;

    return members.map((m) => {
      let memberStats: any = {};
      let imageSrc = "";
      let playerName = m.name;

      if (m.avatarCode === "sales") {
        memberStats = {
          foton: topTeam.fotonUnits,
          mahindra: topTeam.mahindraUnits,
          resale: topTeam.resaleUnits,
        };
        if (spotlightOverrides?.strikerImageBase64) {
          imageSrc = spotlightOverrides.strikerImageBase64;
        }
        if (spotlightOverrides?.strikerName) {
          playerName = spotlightOverrides.strikerName;
        }
      } else if (m.avatarCode === "recovery") {
        memberStats = {
          recovery: topTeam.avgRecoveryPercentage,
        };
        
        goalkeepersProcessed++;
        
        if (goalkeepersProcessed === 1) {
          // First Goalkeeper
          if (spotlightOverrides?.goalkeeperImageBase64) {
            imageSrc = spotlightOverrides.goalkeeperImageBase64;
          }
          if (spotlightOverrides?.goalkeeperName) {
            playerName = spotlightOverrides.goalkeeperName;
          }
        } else {
          // Second Goalkeeper (Dynamically Injected)
          if (spotlightOverrides?.goalkeeper2ImageBase64) {
            imageSrc = spotlightOverrides.goalkeeper2ImageBase64;
          }
          if (spotlightOverrides?.goalkeeper2Name) {
            playerName = spotlightOverrides.goalkeeper2Name;
          }
        }
      } else {
        memberStats = {
          foton: topTeam.fotonUnits,
          recovery: topTeam.avgRecoveryPercentage,
        };
      }

      return {
        playerName,
        role: m.role,
        rating,
        stats: memberStats,
        imageSrc,
      };
    });
  }, [topTeam, spotlightOverrides]);

  // Divisions configuration for navigation
  const tabsConfig = [
    { id: "all", label: "All Standings", color: "var(--fifa-gold)" },
    { id: "Elite", label: "Elite (Top 11)", color: "var(--elite-color)" },
    { id: "Champions", label: "Champions (Next 11)", color: "var(--champions-color)" },
    { id: "Warriors", label: "Warriors (Next 11)", color: "var(--warriors-color)" },
    { id: "Challengers", label: "Challengers (Bottom 11)", color: "var(--challengers-color)" }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "1.5rem" }}>
      {/* 1. TOURNAMENT PLAYER MVPS SECTION */}
      <section className="mb-4" style={{ 
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%)', 
        padding: '1.25rem 0 1rem 0', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.01), inset 0 2px 5px rgba(255,255,255,1)'
      }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "1rem" }}>
            <span style={{ 
              color: "#fff", 
              fontSize: "0.75rem", 
              fontWeight: 800, 
              letterSpacing: "2px", 
              textTransform: "uppercase", 
              background: "linear-gradient(135deg, var(--fifa-burgundy-light), var(--fifa-burgundy))",
              padding: "0.25rem 0.9rem",
              borderRadius: "30px",
              boxShadow: "0 2px 8px rgba(124,18,36,0.2)"
            }}>
              ⭐ Top Territory Spotlight ⭐
            </span>
            <h2 className="text-2xl font-extrabold" style={{ 
              color: 'var(--text-primary)', 
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
              letterSpacing: "-0.5px",
              marginTop: "0.4rem",
              fontSize: "1.5rem"
            }}>
              BEST SQUAD OF THE TOURNAMENT SO FAR
            </h2>
            
            {/* Lucrative & Creative Territory Name Highlight */}
            <div style={{
              margin: '0.8rem 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <style>{`
                @keyframes goldShineSweep {
                  0% { background-position: -200% center; }
                  100% { background-position: 200% center; }
                }
                .territory-leader-glowing {
                  font-family: var(--font-family);
                  font-size: clamp(2rem, 5vw, 3.2rem);
                  font-weight: 900;
                  text-transform: uppercase;
                  letter-spacing: 5px;
                  background: linear-gradient(
                    120deg, 
                    #b8911f 0%, 
                    #fde047 25%, 
                    #ffffff 50%, 
                    #fde047 75%, 
                    #b8911f 100%
                  );
                  background-size: 200% auto;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  animation: goldShineSweep 6s linear infinite;
                  filter: drop-shadow(0 0 15px rgba(223, 183, 44, 0.45));
                  display: inline-flex;
                  alignItems: center;
                  gap: 1rem;
                }
              `}</style>
              <div className="territory-leader-glowing">
                <span>⚡</span>
                {topTeam?.name}
                <span>⚡</span>
              </div>
            </div>

            <p className="text-secondary" style={{ fontSize: "0.9rem", marginTop: "0.2rem", fontWeight: 600 }}>
              Leading the CV World Cup standings with <strong style={{ color: 'var(--fifa-gold-dark)' }}>{topTeam?.totalScore.toFixed(1)} PTS</strong> (Sales & Recovery combined)
            </p>
          </div>

          <div className="flex justify-center items-center flex-wrap perspective-1000" style={{ gap: "1.5rem" }}>
            {topTeamMembers.map((member, mIdx) => (
              <div key={mIdx} className="text-center" style={{ perspective: '1000px' }}>
                <div style={{ 
                  color: "var(--fifa-gold-dark)", 
                  fontWeight: 800, 
                  fontSize: "0.75rem", 
                  letterSpacing: "0.5px", 
                  marginBottom: "0.4rem", 
                  textTransform: "uppercase",
                  background: "rgba(223, 183, 44, 0.1)",
                  padding: "0.15rem 0.75rem",
                  borderRadius: "20px",
                  display: "inline-block"
                }}>
                  {member.role === "Sales Striker" ? "⚽ Sales Striker" : member.role === "Recovery Goalkeeper" ? "🧤 Recovery Goalkeeper" : "⚡ Tactical Midfielder"}
                </div>
                <FifaMvpCard 
                  playerName={member.playerName} 
                  role={member.role} 
                  territoryName={topTeam?.name || ""} 
                  rating={member.rating} 
                  stats={member.stats} 
                  imageSrc={member.imageSrc}
                  isSpotlight={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Playbook Rules Drawer */}
      <ScoringPlaybook />

      {/* 2. DIVISION FILTERS */}
      <section className="container mt-4">
        <div className="tournament-tabs">
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              style={{ "--active-color": tab.color } as any}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. LEADERBOARD STANDINGS DISPLAY */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "all" ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <LeaderboardTable division="Elite" color="var(--elite-color)" teams={eliteTeams} />
                <LeaderboardTable division="Champions" color="var(--champions-color)" teams={championsTeams} />
                <LeaderboardTable division="Warriors" color="var(--warriors-color)" teams={warriorsTeams} />
                <LeaderboardTable division="Challengers" color="var(--challengers-color)" teams={challengersTeams} />
              </div>
            ) : (
              <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {activeTab === "Elite" && (
                  <LeaderboardTable division="Elite" color="var(--elite-color)" teams={eliteTeams} />
                )}
                {activeTab === "Champions" && (
                  <LeaderboardTable division="Champions" color="var(--champions-color)" teams={championsTeams} />
                )}
                {activeTab === "Warriors" && (
                  <LeaderboardTable division="Warriors" color="var(--warriors-color)" teams={warriorsTeams} />
                )}
                {activeTab === "Challengers" && (
                  <LeaderboardTable division="Challengers" color="var(--challengers-color)" teams={challengersTeams} />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
