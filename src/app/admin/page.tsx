"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScorecardGenerator from '@/components/ScorecardGenerator';

const ALL_TERRITORIES = [
  "B. Baria", "Barisal", "Bogura", "Borguna", "Chandpur", "Chapainawabgonj", 
  "Chattogram North", "Chattogram South", "Cox's Bazar", "Cumilla 1", "Cumilla-2", 
  "Dhaka North", "Dhaka South", "Dhaka-3", "Dinajpur", "Feni", "Gazipur", 
  "Gopalganj", "Hobiganj", "Jamalpur", "Jashore", "Jhenaidah", "Khulna", 
  "Kishoreganj", "Kushtia", "Laxmipur", "Madaripur", "Manikganj", "Munshiganj", 
  "Mymensingh", "Narayanganj", "Narshingdi", "Natore", "Netrokona", "Nilphamari", 
  "Noakhali", "Rajshahi", "Rangpur", "Savar", "Sirajganj", "Sylhet", "Tangail", 
  "Thakurgaon", "Tongi"
];

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reseedLoading, setReseedLoading] = useState(false);

  const handleReseed = async () => {
    if (!confirm('Are you sure you want to reset the database? This will clear all standings, scores, MVPs, and daily logs, and restore the default 44 territories with mock performance history.')) {
      return;
    }
    setReseedLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert('Database reseeded successfully! Returning to Standing Tables.');
        window.location.href = '/';
      } else {
        alert(`Error seeding database: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      alert(`Network error: ${e.message || String(e)}`);
    } finally {
      setReseedLoading(false);
    }
  };

  // Spotlight Image & Name Upload State
  const [strikerImage, setStrikerImage] = useState<File | null>(null);
  const [goalkeeperImage, setGoalkeeperImage] = useState<File | null>(null);
  const [goalkeeper2Image, setGoalkeeper2Image] = useState<File | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [strikerNameInput, setStrikerNameInput] = useState('');
  const [goalkeeperNameInput, setGoalkeeperNameInput] = useState('');
  const [goalkeeper2NameInput, setGoalkeeper2NameInput] = useState('');
  const [currentStrikerImage, setCurrentStrikerImage] = useState<string | null>(null);
  const [currentGoalkeeperImage, setCurrentGoalkeeperImage] = useState<string | null>(null);
  const [currentGoalkeeper2Image, setCurrentGoalkeeper2Image] = useState<string | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('Admin');
  const [loginError, setLoginError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [territorySearch, setTerritorySearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(sessionStorage.getItem('admin_auth') === 'true');
    }
  }, []);

  useEffect(() => {
    const fetchSpotlightNames = async () => {
      try {
        const res = await fetch('/api/admin/upload-images');
        if (res.ok) {
          const data = await res.json();
          setStrikerNameInput(data.strikerName || '');
          setGoalkeeperNameInput(data.goalkeeperName || '');
          setGoalkeeper2NameInput(data.goalkeeper2Name || '');
          setCurrentStrikerImage(data.strikerImage || null);
          setCurrentGoalkeeperImage(data.goalkeeperImage || null);
          setCurrentGoalkeeper2Image(data.goalkeeper2Image || null);
        }
      } catch (e) {}
    };
    if (isAuthenticated) {
      fetchSpotlightNames();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = usernameInput.trim().toLowerCase();
    const pass = passwordInput.trim().toLowerCase();
    
    if (user === 'admin' && (pass === 'admin' || pass === 'imon0123')) {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Access Denied: Invalid Credentials (Use admin / Admin)');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('date', date);

    try {
      const res = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Success! Standings recalculated. Processed ${data.processed} records.`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to upload file.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim()) {
      setImageUploadMessage('Error: Please enter names or select image files.');
      return;
    }

    setImageUploadLoading(true);
    setImageUploadMessage('');

    const formData = new FormData();
    if (strikerImage) formData.append('striker', strikerImage);
    if (goalkeeperImage) formData.append('goalkeeper', goalkeeperImage);
    if (goalkeeper2Image) formData.append('goalkeeper2', goalkeeper2Image);
    formData.append('strikerName', strikerNameInput);
    formData.append('goalkeeperName', goalkeeperNameInput);
    formData.append('goalkeeper2Name', goalkeeper2NameInput);

    try {
      const res = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImageUploadMessage('Success! Spotlight player data updated.');
        setStrikerImage(null);
        setGoalkeeperImage(null);
        setGoalkeeper2Image(null);
        const strikerInput = document.getElementById('striker-file-input') as HTMLInputElement;
        const gkInput = document.getElementById('gk-file-input') as HTMLInputElement;
        const gk2Input = document.getElementById('gk2-file-input') as HTMLInputElement;
        if (strikerInput) strikerInput.value = '';
        if (gkInput) gkInput.value = '';
        if (gk2Input) gk2Input.value = '';
        
        // Re-fetch to update image thumbnails
        const refetchRes = await fetch('/api/admin/upload-images');
        if (refetchRes.ok) {
          const refetchData = await refetchRes.json();
          setCurrentStrikerImage(refetchData.strikerImage || null);
          setCurrentGoalkeeperImage(refetchData.goalkeeperImage || null);
          setCurrentGoalkeeper2Image(refetchData.goalkeeper2Image || null);
        }
      } else {
        setImageUploadMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setImageUploadMessage('Failed to upload spotlight data.');
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleDeleteImage = async (role: 'striker' | 'goalkeeper' | 'goalkeeper2') => {
    if (!confirm(`Are you sure you want to delete the current ${role} photo?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/upload-images?role=${role}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (role === 'striker') setCurrentStrikerImage(null);
        if (role === 'goalkeeper') setCurrentGoalkeeperImage(null);
        if (role === 'goalkeeper2') setCurrentGoalkeeper2Image(null);
        setImageUploadMessage(`Success: ${role} photo deleted from database.`);
      } else {
        const data = await res.json();
        setImageUploadMessage(`Error: ${data.error || 'Failed to delete photo'}`);
      }
    } catch (err) {
      setImageUploadMessage('Error: Failed to send delete request');
    }
  };


  const downloadTemplate = () => {
    const headers = "territoryName,newSalesFoton,newSalesMahindra,resale,recoveryPercentage\n";
    const sampleRows = ALL_TERRITORIES.map(t => `${t},0,0,0,0.0`).join("\n");
    
    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "daily_log_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const csvHeaders = [
    { name: "territoryName", desc: "Cox's Bazar, Narayanganj, Savar, etc. (must match DB exactly)" },
    { name: "newSalesFoton", desc: "Count of new Foton units sold" },
    { name: "newSalesMahindra", desc: "Count of new Mahindra units sold" },
    { name: "resale", desc: "Count of resale units sold" },
    { name: "recoveryPercentage", desc: "Asset recovery percentage (0 to 100)" }
  ];

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div style={{ color: 'var(--fifa-gold)', fontWeight: 800, letterSpacing: '1px' }}>
          INITIALIZING SECURE PORTAL...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="container flex items-center justify-center" style={{ minHeight: '75vh', padding: '2rem 1.5rem', position: 'relative', zIndex: 10 }}>
        <motion.div
          animate={shaking ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: '420px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(30, 9, 14, 0.95) 0%, rgba(10, 13, 24, 0.98) 100%)',
            border: '2px solid rgba(223, 183, 44, 0.35)',
            boxShadow: '0 25px 60px rgba(124, 18, 36, 0.4), 0 0 30px rgba(223, 183, 44, 0.15)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            color: '#fff',
            fontFamily: 'var(--font-family)'
          }}
        >
          {/* Subtle Golden Glow Circle */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(223, 183, 44, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Logo Brand Header */}
          <div className="text-center mb-6">
            <div style={{
              background: 'var(--fifa-burgundy)',
              padding: '0.4rem 1.0rem',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(223, 183, 44, 0.4)',
              marginBottom: '1rem',
              boxShadow: '0 4px 12px rgba(124, 18, 36, 0.3)'
            }}>
              <img 
                src="https://i.ibb.co.com/N2kYDkbt/ACI-Motors-Logo-AI-White.png" 
                alt="ACI Motors" 
                style={{ height: '22px', objectFit: 'contain' }}
              />
            </div>
            
            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: '0'
            }}>
              Official Scorer Desk
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
              Match Commissioner Credentials Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col" style={{ gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fifa-gold)', letterSpacing: '0.5px', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--fifa-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--fifa-gold)', letterSpacing: '0.5px', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: 'white',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--fifa-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}
              >
                ⚠️ {loginError}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                background: 'linear-gradient(135deg, var(--fifa-gold) 0%, var(--fifa-gold-dark) 100%)',
                color: '#1e293b',
                border: 'none',
                padding: '0.9rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 900,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(223, 183, 44, 0.3)'
              }}
            >
              🔓 UNLOCK COMMISSION PANEL
            </motion.button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="container mt-8 animate-fade-in" style={{ paddingBottom: "4rem", position: 'relative', zIndex: 10 }}>
      {/* Stadium Scorer Header */}
      <div 
        className="text-center py-6 mb-8" 
        style={{ 
          background: 'radial-gradient(circle, rgba(124, 18, 36, 0.3) 0%, rgba(6, 8, 19, 0) 70%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          position: 'relative'
        }}
      >
        <button
          onClick={handleReseed}
          disabled={reseedLoading}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '8.5rem',
            background: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            color: '#f59e0b',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: reseedLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            opacity: reseedLoading ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!reseedLoading) {
              e.currentTarget.style.background = 'rgba(217, 119, 6, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!reseedLoading) {
              e.currentTarget.style.background = 'rgba(217, 119, 6, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)';
            }
          }}
        >
          {reseedLoading ? '🌱 Seeding...' : '🌱 Reset & Seed Database'}
        </button>

        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          🔒 Lock Portal
        </button>

        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 800, 
          color: 'var(--fifa-gold)', 
          letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'block'
        }}>
          ⚙️ OFFICIAL SCORER'S DESK ⚙️
        </span>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 900,
          color: '#fff',
          textShadow: '0 0 20px rgba(223, 183, 44, 0.3)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: '0.25rem 0 0 0'
        }}>
          Match Commissioner Panel
        </h1>
        <p className="text-secondary" style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Upload daily commercial outcomes to dynamically recalculate the world cup divisions and ratings.
        </p>
      </div>

      <div className="grid grid-cols-2" style={{ alignItems: 'start', maxWidth: '1000px', margin: '0 auto', gap: '1.5rem' }}>
        {/* Left Column Stack for Forms */}
        <div className="flex flex-col" style={{ gap: '1.5rem' }}>
          {/* Upload Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
          <h2 className="text-xl font-bold" style={{ color: 'var(--fifa-gold)', marginBottom: '1rem' }}>Upload Daily Log (CSV)</h2>
          <form onSubmit={handleUpload} className="flex flex-col" style={{ gap: '1rem' }}>
            <div>
              <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Fixture / Performance Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: '#0a0d18',
                  color: 'white',
                  colorScheme: 'dark',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>CSV Data File</label>
              <div className="flex items-center" style={{ gap: '0.75rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem', position: 'relative', zIndex: 10 }}>
                <label 
                  htmlFor="csv-upload" 
                  className="btn"
                  style={{ 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    fontSize: '0.75rem',
                    padding: '0.5rem 1.25rem',
                    display: 'inline-block',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, var(--fifa-burgundy-light) 0%, var(--fifa-burgundy) 100%)',
                    border: '1px solid rgba(223, 183, 44, 0.3)',
                    boxShadow: '0 4px 15px rgba(124, 18, 36, 0.3)',
                    borderRadius: '6px',
                    fontWeight: 800,
                  }}
                >
                  Choose File
                </label>
                <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
              <input 
                id="csv-upload"
                type="file" 
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              disabled={loading || !file} 
              style={{ 
                width: '100%',
                marginTop: '0.5rem',
                opacity: (loading || !file) ? 0.5 : 1,
                cursor: (loading || !file) ? 'not-allowed' : 'pointer',
                background: (loading || !file) ? '#475569' : undefined,
                boxShadow: (loading || !file) ? 'none' : undefined,
              }}
            >
              {loading ? 'Processing Matchday Log...' : '⚡ Submit Day Results'}
            </button>
            
            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`py-3 px-4 mt-2 font-bold text-center ${message.startsWith('Error') ? 'text-danger' : 'text-success'}`} 
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  borderRadius: '8px',
                  border: `1px solid ${message.startsWith('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
                }}
              >
                {message}
              </motion.div>
            )}
          </form>
          </motion.div>
 
          {/* Spotlight Image Upload Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-bold" style={{ color: 'var(--fifa-gold)', marginBottom: '1rem' }}>Spotlight Players Customization</h2>
            <form onSubmit={handleImageUpload} className="flex flex-col" style={{ gap: '1rem' }}>
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Sales Striker Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    value={strikerNameInput}
                    onChange={(e) => setStrikerNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: '#0a0d18',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Sales Striker Photo</label>
                  <div className="flex flex-col animate-fade-in" style={{ gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', position: 'relative', zIndex: 10 }}>
                    {currentStrikerImage && (
                      <div className="flex items-center justify-between" style={{ padding: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.25rem', gap: '0.5rem' }}>
                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                          <img src={currentStrikerImage} alt="Current Striker" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--fifa-gold)' }} />
                          <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600 }}>Active Image</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteImage('striker')} 
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                    <label 
                      htmlFor="striker-file-input" 
                      className="btn"
                      style={{ 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                        padding: '0.5rem 1rem',
                        display: 'inline-block',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, var(--fifa-burgundy-light) 0%, var(--fifa-burgundy) 100%)',
                        border: '1px solid rgba(223, 183, 44, 0.3)',
                        boxShadow: '0 4px 15px rgba(124, 18, 36, 0.3)',
                        borderRadius: '6px',
                        fontWeight: 800,
                      }}
                    >
                      Choose Image
                    </label>
                    <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }} title={strikerImage ? strikerImage.name : ""}>
                      {strikerImage ? strikerImage.name : "No file chosen"}
                    </span>
                  </div>
                  <input 
                    id="striker-file-input"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setStrikerImage(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>Recovery Goalkeeper Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    value={goalkeeperNameInput}
                    onChange={(e) => setGoalkeeperNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: '#0a0d18',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Recovery Goalkeeper Photo</label>
                  <div className="flex flex-col animate-fade-in" style={{ gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', position: 'relative', zIndex: 10 }}>
                    {currentGoalkeeperImage && (
                      <div className="flex items-center justify-between" style={{ padding: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.25rem', gap: '0.5rem' }}>
                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                          <img src={currentGoalkeeperImage} alt="Current Goalkeeper" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--fifa-gold)' }} />
                          <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600 }}>Active Image</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteImage('goalkeeper')} 
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                    <label 
                      htmlFor="gk-file-input" 
                      className="btn"
                      style={{ 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                        padding: '0.5rem 1rem',
                        display: 'inline-block',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, var(--fifa-burgundy-light) 0%, var(--fifa-burgundy) 100%)',
                        border: '1px solid rgba(223, 183, 44, 0.3)',
                        boxShadow: '0 4px 15px rgba(124, 18, 36, 0.3)',
                        borderRadius: '6px',
                        fontWeight: 800,
                      }}
                    >
                      Choose Image
                    </label>
                    <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }} title={goalkeeperImage ? goalkeeperImage.name : ""}>
                      {goalkeeperImage ? goalkeeperImage.name : "No file chosen"}
                    </span>
                  </div>
                  <input 
                    id="gk-file-input"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setGoalkeeperImage(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', display: 'block', marginBottom: '0.5rem' }}>2nd Recovery Goalkeeper Name (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    value={goalkeeper2NameInput}
                    onChange={(e) => setGoalkeeper2NameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: '#0a0d18',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label className="font-bold" style={{ fontSize: '0.85rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>2nd Goalkeeper Photo</label>
                  <div className="flex flex-col animate-fade-in" style={{ gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', position: 'relative', zIndex: 10 }}>
                    {currentGoalkeeper2Image && (
                      <div className="flex items-center justify-between" style={{ padding: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.25rem', gap: '0.5rem' }}>
                        <div className="flex items-center" style={{ gap: '0.5rem' }}>
                          <img src={currentGoalkeeper2Image} alt="Current Goalkeeper 2" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--fifa-gold)' }} />
                          <span style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600 }}>Active Image</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteImage('goalkeeper2')} 
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                    <label 
                      htmlFor="gk2-file-input" 
                      className="btn"
                      style={{ 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
                        padding: '0.5rem 1rem',
                        display: 'inline-block',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, var(--fifa-burgundy-light) 0%, var(--fifa-burgundy) 100%)',
                        border: '1px solid rgba(223, 183, 44, 0.3)',
                        boxShadow: '0 4px 15px rgba(124, 18, 36, 0.3)',
                        borderRadius: '6px',
                        fontWeight: 800,
                      }}
                    >
                      Choose Image
                    </label>
                    <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }} title={goalkeeper2Image ? goalkeeper2Image.name : ""}>
                      {goalkeeper2Image ? goalkeeper2Image.name : "No file chosen"}
                    </span>
                  </div>
                  <input 
                    id="gk2-file-input"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setGoalkeeper2Image(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn" 
                disabled={imageUploadLoading || (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim())} 
                style={{ 
                  width: '100%',
                  marginTop: '0.5rem',
                  opacity: (imageUploadLoading || (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim())) ? 0.5 : 1,
                  cursor: (imageUploadLoading || (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim())) ? 'not-allowed' : 'pointer',
                  background: (imageUploadLoading || (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim())) ? '#475569' : undefined,
                  boxShadow: (imageUploadLoading || (!strikerImage && !goalkeeperImage && !goalkeeper2Image && !strikerNameInput.trim() && !goalkeeperNameInput.trim() && !goalkeeper2NameInput.trim())) ? 'none' : undefined,
                }}
              >
                {imageUploadLoading ? 'Saving Player Data...' : '⚡ Save Spotlight Customization'}
              </button>
              
              {imageUploadMessage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`py-3 px-4 mt-2 font-bold text-center ${imageUploadMessage.startsWith('Error') ? 'text-danger' : 'text-success'}`} 
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.2)', 
                    borderRadius: '8px',
                    border: `1px solid ${imageUploadMessage.startsWith('Error') ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`
                  }}
                >
                  {imageUploadMessage}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        <ScorecardGenerator />

        {/* Template Format Details Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--fifa-gold)', margin: 0 }}>CSV Log Template Specifications</h2>
            <button 
              onClick={downloadTemplate}
              type="button"
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(223, 183, 44, 0.15)',
                border: '1px solid var(--fifa-gold)',
                color: 'var(--fifa-gold)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 800,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--fifa-gold)';
                e.currentTarget.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(223, 183, 44, 0.15)';
                e.currentTarget.style.color = 'var(--fifa-gold)';
              }}
            >
              📥 Download Template
            </button>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '1rem' }}>
            Ensure your CSV file contains the following precise headers (comma-separated). Names of territories must match real Bangladeshi territories listed in the database (e.g. Savar, Narayanganj, Cox's Bazar).
          </p>
 
          <div className="flex flex-col" style={{ gap: '0.75rem' }}>
            {csvHeaders.map((header) => (
              <div key={header.name} style={{
                background: 'rgba(0,0,0,0.15)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.03)'
              }}>
                <div className="flex items-center justify-between">
                  <code style={{ color: 'var(--fifa-gold)', fontWeight: 800, fontSize: '0.85rem' }}>{header.name}</code>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Required</span>
                </div>
                <div className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{header.desc}</div>
              </div>
            ))}
          </div>

          {/* Supported Territories List */}
          <div style={{ 
            marginTop: '1.5rem', 
            borderTop: '1px solid rgba(255,255,255,0.08)', 
            paddingTop: '1.25rem' 
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 800, 
              color: 'var(--fifa-gold)', 
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>📍 SUPPORTED TERRITORIES (44)</span>
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(223, 183, 44, 0.1)',
                color: 'var(--fifa-gold)',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid rgba(223, 183, 44, 0.2)'
              }}>
                Pre-populated in Template
              </span>
            </h3>
            
            <p className="text-secondary mb-3" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
              These are the official database-seeded territory names. When compiling your log, make sure the <code>territoryName</code> column matches one of these values exactly.
            </p>

            <div style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="🔍 Search territory..."
                value={territorySearch}
                onChange={(e) => setTerritorySearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  color: 'white',
                  fontSize: '0.8rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
              scrollbarWidth: 'thin'
            }}>
              {ALL_TERRITORIES.filter(t => t.toLowerCase().includes(territorySearch.toLowerCase())).map((t) => (
                <span 
                  key={t}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--fifa-gold)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(223, 183, 44, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }}
                >
                  {t}
                </span>
              ))}
              {ALL_TERRITORIES.filter(t => t.toLowerCase().includes(territorySearch.toLowerCase())).length === 0 && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', width: '100%', textAlign: 'center', padding: '1rem 0' }}>
                  No matching territories found.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
