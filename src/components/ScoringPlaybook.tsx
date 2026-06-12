"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScoringPlaybook() {
  const [isOpen, setIsOpen] = useState(false);

  const tableData = [
    {
      metric: "New Sales",
      multiplier: "+3 Points per unit",
      maxPoints: "20 Points",
      notes: "Sum of new Foton & Mahindra units sold."
    },
    {
      metric: "Resale Sales",
      multiplier: "+5 Points per unit",
      maxPoints: "30 Points",
      notes: "Resale units sold."
    },
    {
      metric: "Aggression Bonus",
      multiplier: "+2 Points per unit",
      maxPoints: "10 Points",
      notes: "Extra +2 pts for any new Mahindra unit, OR any resale unit sold beyond the 6th unit."
    },
    {
      metric: "Asset Recovery",
      multiplier: "+0.4 Points per %",
      maxPoints: "40 Points",
      notes: "Calculated as: Recovery % × 0.4 (e.g. 90% recovery = 36 pts)."
    },
    {
      metric: "Total Score",
      multiplier: "Sum of above",
      maxPoints: "100 Points",
      notes: "The maximum daily cap is 100 points."
    }
  ];

  return (
    <div style={{ maxWidth: "1280px", margin: "1.5rem auto 0 auto" }} className="px-4">
      {/* Playbook Drawer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: "linear-gradient(90deg, rgba(124, 18, 36, 0.04) 0%, rgba(223, 183, 44, 0.04) 100%)",
          border: "1px solid rgba(124, 18, 36, 0.1)",
          borderRadius: "12px",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          transition: "all 0.3s ease",
          outline: "none"
        }}
        className="playbook-toggle-btn"
      >
        <span className="flex items-center" style={{ gap: "0.6rem", fontWeight: 700, color: "var(--fifa-burgundy-light)" }}>
          📋 <span style={{ letterSpacing: "0.5px" }}>ACI MOTORS OFFICIAL CVWC PERFORMANCE SCORING SYSTEM</span>
        </span>
        <span style={{
          color: "var(--fifa-burgundy-light)",
          fontWeight: 800,
          fontSize: "0.9rem",
          transition: "transform 0.3s ease",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
        }}>
          ▼
        </span>
      </button>

      {/* Expanded Chalkboard Rules Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: "12px",
              padding: "1.75rem",
              marginTop: "0.5rem",
              boxShadow: "0 6px 20px rgba(0,0,0,0.02)"
            }}>
              {/* Header */}
              <div className="text-center mb-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "1rem" }}>
                <span style={{ 
                  color: "var(--fifa-gold-dark)", 
                  fontSize: "0.75rem", 
                  fontWeight: 800, 
                  letterSpacing: "1.5px",
                  textTransform: "uppercase" 
                }}>
                  Official Rules
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>
                  Performance Scoring
                </h3>
                <p className="text-secondary" style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>
                  All uploaded scores and standings are calculated based on <strong>Till Date (Cumulative)</strong> numbers rather than daily averages.
                </p>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                  color: "var(--text-primary)",
                  textAlign: "left"
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: "2px solid rgba(124, 18, 36, 0.15)",
                      color: "var(--fifa-burgundy-light)",
                      fontWeight: 800
                    }}>
                      <th style={{ padding: "0.75rem 1rem" }}>Metric</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Point Multiplier</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Capped Max Points</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, idx) => {
                      const isTotal = row.metric === "Total Score";
                      return (
                        <tr 
                          key={idx}
                          style={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                            backgroundColor: isTotal ? "rgba(223, 183, 44, 0.05)" : "transparent",
                            fontWeight: isTotal ? "800" : "inherit"
                          }}
                        >
                          <td style={{ 
                            padding: "0.75rem 1rem", 
                            color: isTotal ? "var(--fifa-burgundy-light)" : "inherit",
                            fontWeight: 700 
                          }}>
                            {row.metric}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>{row.multiplier}</td>
                          <td style={{ 
                            padding: "0.75rem 1rem", 
                            color: isTotal || row.metric === "Asset Recovery" ? "var(--fifa-pitch-green)" : "inherit",
                            fontWeight: 700 
                          }}>
                            {row.maxPoints}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>{row.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
