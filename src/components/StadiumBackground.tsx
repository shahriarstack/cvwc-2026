"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Local high-performance assets for the live stadium background and crowd ambiance.
const VIDEO_URL = "/mp_.mp4"; 
const AUDIO_URL = "/Spirit_in_the_Wheels.mp3"; 

export default function StadiumBackground() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false); // Music is ON by default!
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Generate random magical volumetric particles
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    // Attempt to autoplay audio when component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set a reasonable background volume
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Autoplay started successfully (e.g. user previously interacted with domain)
          setIsMuted(false);
        }).catch(error => {
          // Autoplay blocked by browser policy. Remains muted.
          setIsMuted(true);
          console.warn("Audio autoplay was blocked by the browser. User must manually unmute.");
        });
      }
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          overflow: 'hidden',
          backgroundColor: '#051b11' // Deep emerald fallback
        }}
      >
        {/* Live Video Background */}
        <video 
          autoPlay 
          loop 
          muted // The video MUST be muted to autoplay consistently across all browsers
          playsInline
          poster="/stadium_bg.png" // Uses the existing stadium image while loading or if video fails
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6 // Slightly dimmed so the dashboard text pops
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Ambient Stadium Audio */}
        <audio 
          ref={audioRef}
          loop 
          autoPlay
          src={AUDIO_URL} 
        />

        {/* Volumetric Gold & Emerald Vignette Glass Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(240, 244, 248, 0.4) 0%, rgba(240, 244, 248, 0.85) 100%)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        ></div>

        {/* Floating Magic Dust / Stadium Particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ 
                x: `${p.x}vw`, 
                y: `${p.y}vh`, 
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: [`${p.y}vh`, `${p.y - 20}vh`],
                x: [`${p.x}vw`, `${p.x + (Math.random() > 0.5 ? 5 : -5)}vw`],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: 'rgba(223, 183, 44, 0.6)',
                boxShadow: '0 0 10px rgba(223, 183, 44, 0.8)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Sound Toggle Button */}
      <motion.button
        onClick={toggleMute}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999, // Ensure it's above everything including dashboard
          background: 'rgba(20, 0, 5, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(223, 183, 44, 0.5)',
          borderRadius: '30px',
          padding: '10px 20px',
          color: 'var(--fifa-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          fontFamily: 'inherit',
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '1px'
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: isMuted ? '#ff4444' : '#00C851',
          boxShadow: `0 0 10px ${isMuted ? '#ff4444' : '#00C851'}`,
          transition: 'all 0.3s ease'
        }} />
        {isMuted ? 'MUSIC OFF' : 'SPIRIT IN THE WHEELS'}
      </motion.button>
    </>
  );
}
