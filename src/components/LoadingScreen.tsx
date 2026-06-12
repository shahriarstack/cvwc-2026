"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'loading' | 'transition' | 'hidden'>('loading');

  useEffect(() => {
    // Phase 1: Loading (0-3000ms)
    // Phase 2: Football transition (3000ms - 4500ms)
    // Phase 3: Hidden (4500ms+)
    
    const transitionTimer = setTimeout(() => {
      setPhase('transition');
    }, 3200);

    const hiddenTimer = setTimeout(() => {
      setPhase('hidden');
    }, 4500);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(hiddenTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'hidden' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'var(--fifa-burgundy)',
            background: 'linear-gradient(135deg, var(--fifa-burgundy) 0%, #3e0711 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          {/* Subtle animated background elements */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: '150vw',
              height: '150vw',
              maxWidth: '800px',
              maxHeight: '800px',
              background: 'radial-gradient(circle, rgba(223, 183, 44, 0.1) 0%, transparent 60%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 0
            }}
          />

          <AnimatePresence>
            {phase === 'loading' && (
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: "backIn" }}
                style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                  <h2 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    letterSpacing: '3px',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}>
                    Welcome To
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                  <style>{`
                    @keyframes lucrativeShine {
                      0% { background-position: 0% 50%; filter: drop-shadow(0 4px 10px rgba(223, 183, 44, 0.4)); transform: scale(1); }
                      50% { background-position: 100% 50%; filter: drop-shadow(0 8px 30px rgba(223, 183, 44, 0.8)); transform: scale(1.05); }
                      100% { background-position: 0% 50%; filter: drop-shadow(0 4px 10px rgba(223, 183, 44, 0.4)); transform: scale(1); }
                    }
                    .lucrative-title-loading {
                      background: linear-gradient(90deg, #b8911f 0%, #dfb72c 25%, #ffffff 50%, #dfb72c 75%, #b8911f 100%);
                      background-size: 200% auto;
                      -webkit-background-clip: text;
                      -webkit-text-fill-color: transparent;
                      animation: lucrativeShine 3s ease-in-out infinite;
                    }
                  `}</style>
                  <h1 className="lucrative-title-loading" style={{ 
                    fontSize: 'clamp(3rem, 10vw, 6rem)', 
                    fontWeight: 900,
                    letterSpacing: '2px',
                    margin: '0 0 2rem 0',
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    display: 'inline-block'
                  }}>
                    CV WORLD CUP 2026
                  </h1>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}
                >
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: 'rgba(255,255,255,0.6)', 
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '2px'
                    }}>
                      Present by
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src="https://i.ibb.co.com/N2kYDkbt/ACI-Motors-Logo-AI-White.png" 
                        alt="ACI Motors" 
                        style={{ height: '30px', objectFit: 'contain' }}
                      />
                      <p style={{ 
                        fontSize: '1rem', 
                        fontWeight: 700, 
                        color: 'white',
                        letterSpacing: '1px'
                      }}>
                        Commercial Vehicle Business
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                  >
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '1rem'
                    }}>
                      Powered by 
                      <strong style={{ color: 'white', fontWeight: 800 }}>FOTON</strong> 
                      <span style={{ color: 'var(--fifa-gold)' }}>|</span> 
                      <strong style={{ color: 'white', fontWeight: 800 }}>Mahindra</strong>
                    </p>
                  </motion.div>
                </motion.div>

                {/* Loading Bar */}
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '10%',
                    width: '200px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                    style={{
                      height: '100%',
                      background: 'var(--fifa-gold)',
                      boxShadow: '0 0 10px var(--fifa-gold)'
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Football transition effect - Smoother & Lighter */}
          <AnimatePresence>
            {phase === 'transition' && (
              <motion.div
                initial={{ 
                  x: '-100vw', 
                  y: '30vh',
                  rotate: -360,
                  scale: 1.5,
                  opacity: 1
                }}
                animate={{ 
                  x: '100vw', 
                  y: '-30vh',
                  rotate: 720,
                  scale: 2.5,
                  opacity: 1
                }}
                transition={{ 
                  duration: 1.1, 
                  ease: "easeInOut" 
                }}
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                {/* Dynamic Glowing Trail */}
                <motion.div
                  initial={{ width: '0px', opacity: 0 }}
                  animate={{ width: '400px', opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    right: '50%',
                    height: '12px',
                    background: 'linear-gradient(90deg, transparent, rgba(223, 183, 44, 0.9), rgba(255, 255, 255, 1))',
                    borderRadius: '10px',
                    filter: 'blur(6px)',
                    transformOrigin: 'right center',
                  }}
                />
                
                {/* Football */}
                <div style={{
                  fontSize: '5rem',
                  filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.6))',
                  lineHeight: 1,
                  position: 'relative',
                  zIndex: 2
                }}>
                  ⚽
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
