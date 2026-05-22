import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  // --- React UI States ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Auth Check on Mount ---
  useEffect(() => {
    // Checking "user" to match your code's updateHeader logic
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsDrawerOpen(false);
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
          {isLoggedIn && (
            <li id="menuProfile">
              <Link to="/profile" onClick={() => setIsDrawerOpen(false)}>Profile</Link>
            </li>
          )}
          <li>
            <Link to="/use" onClick={() => setIsDrawerOpen(false)}>How to Use</Link>
          </li>
          <li>
            <Link to="/privacy" onClick={() => setIsDrawerOpen(false)}>Privacy Policy</Link>
          </li>
          <li>
            <a href="#about-section" onClick={() => setIsDrawerOpen(false)}>About</a>
          </li>
          {isLoggedIn && (
            <li 
              id="menuLogout" 
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
            >
              Logout
            </li>
          )}
        </ul>
      </div>

      {/* Overlay Backdrop */}
      <div 
        className={`overlay ${isDrawerOpen ? 'show' : ''}`} 
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* ===================== MAIN CONTENT ===================== */}
      <main className="privacy-main">
        <div style={{ textAlign: 'center' }}>
          <p className="tagline" style={{ color: 'red' }}>
            (Do not Enter <b style={{ color: '#0ff' }}>Real Info</b> <b style={{ color: '#0ff' }}>as it's a</b> demo project.)
          </p>
        </div>
        <br />

        <section className="hero">
          <h1>Privacy Policy</h1>
          <p className="lead">ScheDuler IoT Demo Platform</p>
        </section>

        <section className="card">
          <h2>1. Overview</h2>
          <p>
            This project is a <strong>demonstration IoT control platform</strong>.  
            It showcases how a secure frontend and backend can manage users and devices using
            modern web technologies. It is designed for testing, learning, and demonstration — 
            not for handling sensitive personal data or production-grade use.
          </p>
        </section>

        <section className="card">
          <h2>2. Data Collected</h2>
          <ul className="steps">
            <li><strong>Account Information:</strong> Username, email, and (optionally) phone number entered at signup.</li>
            <li><strong>Device Data:</strong> Each device or switch name you add (label, state, timestamps).</li>
            <li><strong>Session Info:</strong> Temporary login sessions stored securely using <code>JWT</code>.</li>
            <li><strong>Recovery Code:</strong> A one-time generated code for account recovery purposes, stored securely (hashed) and visible only once during signup.</li>
          </ul>
        </section>

        <section className="card">
          <h2>3. Security &amp; Data Handling</h2>
          <ul className="steps">
            <li><strong>Database (D1):</strong> All user and device data is stored in a <code>D1</code> database managed by Cloudflare. Each user record is isolated and linked via a unique identifier.</li>
            <li><strong>Key-Value (KV):</strong> Used for session handling or lightweight caching when required.</li>
            <li><strong>Password Hashing:</strong> User passwords are never stored in plain text. Each password is securely hashed using an algorithm such as <code>bcrypt</code> or similar salted hash before saving to D1.</li>
            <li><strong>JWT Authentication:</strong> After login, a signed JSON Web Token (<code>JWT</code>) is issued to verify user identity for each request without exposing credentials.</li>
            <li><strong>Recovery System:</strong> A unique one-time recovery code is generated on signup and shown once. It is stored in hashed form; the original is never retrievable by anyone (including the admin).</li>
            <li><strong>Data Transmission:</strong> All communication is handled via secure HTTPS when deployed. For local demo mode (e.g., <code>0.0.0.0:8080</code>), SSL is not enforced — this is expected in a development environment.</li>
          </ul>
        </section>

        <section className="card">
          <h2>4. Usage &amp; Retention</h2>
          <ul className="steps">
            <li>User accounts and device entries remain stored until manually deleted or until the demo database is reset.</li>
            <li>Switch states are only retained for demonstration and testing purposes.</li>
            <li>JWT sessions automatically expire after a set time (e.g., 24 hours) or upon logout.</li>
          </ul>
        </section>

        <section className="card">
          <h2>5. Limitations</h2>
          <p>
            This project is intended for <strong>testing and learning</strong>.  
            While strong encryption and hashing practices are used, it is not a production-ready system.  
            Do not store or use sensitive or personal data. 
            Any data loss due to database resets or local testing is not permanent or recoverable.
          </p>
        </section>

        <section className="card">
          <h2>6. Your Control</h2>
          <ul className="steps">
            <li>You can delete your account or remove devices at any time.</li>
            <li>Upon deletion, your related entries in D1 (user + device) are permanently removed.</li>
            <li>To reset your password, use your recovery code or contact the project maintainer (for demo support only).</li>
          </ul>
        </section>

        <section className="card">
          <h2>7. Transparency</h2>
          <p>
            For demo purposes, we do not collect personal data. Passwords and recovery codes are hashed.
            Even unreal Email addresses are allowed, example like "test@gmail.com" or "t@gmail.com".
          </p>
        </section>

        <section className="card about" id="about-section">
          <h2>About ScheDuler IoT</h2>
          <p>
            ScheDuler IoT is a project showcasing how web-based dashboards can safely interact with IoT devices using simple,
            secure endpoints and a reactive UI. Built using Cloudflare Workers, D1, KV storage, JWT, and standard web encryption methods.
          </p>
        </section>

        <footer className="small-footer">
          <p>
            Return to <Link to="/">Home</Link> or see <Link to="/use">How to Use</Link>.
          </p>
        </footer>
      </main>
    </>
  );
}
