import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  // --- React State Management ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // --- Auth Check on Mount ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsDrawerOpen(false);
  };

  // --- Login Form Submit ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: email.trim(), password: password.trim() }),
      });
      
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      setIsModalOpen(false);
      
      // Clean up input fields
      setEmail('');
      setPassword('');

      // Redirect to profile inside React Router
      navigate('/profile');
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <>
      {/* ===================== HEADER ===================== */}
      <header className="header-bar">
        <div className="rank-display">
          <span className="rank-label">Sche</span>
          <span className="rank-title">Duler</span>
        </div>
      </header>

      {/* Hamburger Icon */}
      <div className="menu-wrapper">
        <button 
          className="hamburger-icon" 
          onClick={() => setIsDrawerOpen(true)}
        >
          &#9776;
        </button>
      </div>

      {/* ===================== CATEGORY DRAWER ===================== */}
      <div className={`category-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <button 
          className="category-close" 
          onClick={() => setIsDrawerOpen(false)}
        >
          &times;
        </button>

        <div style={{ textAlign: 'center' }}>
          <h3>User Menu</h3>
        </div>
        
        <ul className="user-menu-list">
          {!isLoggedIn ? (
            <li>
              <button 
                onClick={() => { setIsDrawerOpen(false); setIsModalOpen(true); }}
                style={{ background: 'none', border: 'none', color: 'var(--neon-gold)', fontSize: '1rem', padding: 0, cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' }}
              >
                Login
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/profile" onClick={() => setIsDrawerOpen(false)}>Profile</Link>
              </li>
              <li 
                onClick={handleLogout} 
                style={{ color: 'gold', cursor: 'pointer' }}
              >
                Logout
              </li>
            </>
          )}
          <li><Link to="/use" onClick={() => setIsDrawerOpen(false)}>How to Use</Link></li>
          <li><a href="#about-section" onClick={() => setIsDrawerOpen(false)}>About</a></li>
          <li><Link to="/privacy" onClick={() => setIsDrawerOpen(false)}>Privacy Policy</Link></li>
        </ul>
      </div>

      {/* Overlay Backdrop */}
      <div 
        className={`overlay ${isDrawerOpen ? 'show' : ''}`} 
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* ===================== MAIN CONTENT ===================== */}
      <main id="mainContent">
        <section className="info-section">
          <h2 id="iot-heading" style={{ color: '#00ffcc' }}>
            Welcome to <b style={{ color: '#0ff' }}>ScheDuler IoT Control</b>
          </h2>
          <p className="tagline" style={{ color: '#ccc' }}>
            Your <b style={{ color: '#0ff' }}>secure</b>, <b style={{ color: '#0ff' }}>centralized</b> platform for managing connected devices.
          </p>
          <br />
          <div style={{ textAlign: 'center' }}>
            <p className="tagline" style={{ color: 'red' }}>
              (Do not Enter <b style={{ color: '#0ff' }}>Real Info</b> <b style={{ color: '#0ff' }}>as it's a</b> demo project.)
            </p>
          </div>
          <br />
        </section>

        {/* Dynamic Login Callout Button */}
        {!isLoggedIn && (
          <section className="info-card-container login-callout-section">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <button 
                className="load-more" 
                style={{ width: '90%', maxWidth: '300px' }}
                onClick={() => setIsModalOpen(true)}
              >
                Start Controlling Your Devices (Login)
              </button>
            </div>
          </section>
        )}

        {/* Info Cards */}
        <section className="info-card-container">
          <div className="info-card">
            <h3 style={{ color: '#00ffcc' }}>💡 What is IoT?</h3>
            <p>
              The <b style={{ color: '#0ff' }}>Internet of Things (IoT)</b> connects physical devices — sensors, switches, and machines — to the internet.  
              It allows them to collect, send, and act on data without human intervention.  
              This makes systems more <b style={{ color: '#0ff' }}>efficient, responsive,</b> and <b style={{ color: '#0ff' }}>automated</b>.  
              ScheDuler IoT bridges that gap, letting you control your devices directly from your browser.
            </p>
          </div>

          <div className="info-card">
            <h3 style={{ color: '#00ffcc' }}>⚙️ Key Functions</h3>
            <ul style={{ listStyleType: "'🚀 '", marginLeft: '1em' }}>
              <li><b style={{ color: '#0ff' }}>Real-Time Monitoring:</b> Instantly view live device data and status updates.</li>
              <li><b style={{ color: '#0ff' }}>Remote Control:</b> Turn devices <b>on/off</b>, adjust configurations, and schedule actions from anywhere.</li>
              <li><b style={{ color: '#0ff' }}>Security:</b> Data and sessions are protected with <b>token-based authentication</b> and encryption.</li>
              <li><b style={{ color: '#0ff' }}>Profile Management:</b> Organize device groups, automate routines, and track performance easily.</li>
              <li><b style={{ color: '#0ff' }}>Recovery System:</b> Built-in <b>password reset</b> ensures account access is always recoverable.</li>
              <li><b style={{ color: '#0ff' }}>Free & Open:</b> User get Free device connection and switches to add.</li>
            </ul>
          </div>

          <div className="info-card" id="about-section">
            <h3 style={{ color: '#00ffcc' }}>📘 About This Project</h3>
            <p>
              <b style={{ color: '#0ff' }}>ScheDuler</b> (ScheDuler IoT Control) is a lightweight webapp combining  
              <b style={{ color: '#0ff' }}>Cloudflare Pages(future is Workers)</b> with <b style={{ color: '#0ff' }}>ESP-based IoT devices</b> for real-time control and automation.  
              Designed for simplicity, it offers <b style={{ color: '#0ff' }}>secure login, instant device control,</b> and <b style={{ color: '#0ff' }}>live feedback</b> —  
              all from one centralized dashboard.
            </p>
            <p style={{ marginTop: '15px', color: '#aaa', fontSize: '0.9em' }}>
              <b style={{ color: '#0ff' }}>How to use:</b> Login to access your personal dashboard.  
              Securely add, monitor, and control your smart devices in seconds.
            </p>
          </div>
        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <p>
          <a href="#about-section" style={{ color: '#fbbf24', marginRight: '10px' }}>About</a> |{' '}
          <a href="#" style={{ color: '#fbbf24' }}>Some List</a>
        </p>
        <p>&copy; 2025 Scheduler</p>
      </footer>

      {/* ===================== LOGIN MODAL ===================== */}
      {isModalOpen && (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => e.target.className === 'modal' && setIsModalOpen(false)}>
          <div className="modal-card" style={{ position: 'relative' }}>
            <h2 
              style={{ position: 'absolute', top: '-20px', right: '-25px', fontSize: '1.8rem', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </h2>

            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="password-container">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span 
                  className="toggle-password" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '🔍︎'}
                </span>
              </div>

              <button type="submit">Login</button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link to="/forgot-password" style={{ color: '#4af' }}>Forgot password?</Link>
            </p>
            <p style={{ textAlign: 'center', marginTop: '6px' }}>
              Don’t have an account? <Link to="/signup" style={{ color: '#4af' }}>Sign up</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
