import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Use() {
  // --- React UI States ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Sync Authentication Check ---
  useEffect(() => {
    // Checking "user" to match your code's updateHeader logic
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  // --- Logout Action Handler ---
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

      {/* Hamburger Menu Toggle Icon */}
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
          <li id="menuHowToUse">
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

      {/* Backdrop Overlay Background Element */}
      <div 
        className={`overlay ${isDrawerOpen ? 'show' : ''}`} 
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      {/* ===================== MAIN QUICK START DOCUMENTATION ===================== */}
      <main className="use-main">
        <section className="hero">
          <h1>How to use ScheDuler IoT (Quick Start)</h1>
          <br />
          <div style={{ textAlign: 'center' }}>
            <p className="tagline" style={{ color: 'red' }}>
              (Do not Enter <b style={{ color: '#0ff' }}>Real Info</b> <b style={{ color: '#0ff' }}>as it's a</b> demo project.)
            </p>
          </div>
          <br />
          <p className="lead">Step-by-step demo instructions to add devices and control switches from the web.</p>
        </section>

        {/* STEP 1 CARD */}
        <section className="card">
          <h2>1. Create account &amp; Login</h2>
          <ol className="steps">
            <li>
              <strong>Sign up</strong> via <code>signup</code>. You’ll be shown a <mark className="mono">recovery code</mark> — copy it and keep it safe.
            </li>
            <li>
              <strong>Login</strong> from the main page or the drawer. After login you land on <code>profile</code>.
            </li>
            <li>
              On successful signup your data are stored safely using <code>secret session tokens</code> for better security.
            </li>
          </ol>
        </section>

        {/* STEP 2 CARD */}
        <section className="card">
          <h2>2. Add &amp; Connect a Device</h2>
          <ol className="steps">
            <li>Open <strong>Profile</strong> → go to <em>Devices</em> section.</li>
            <li>Type a friendly device name or the device IP into the box and click <strong>Connect</strong>. This stores a demo connection in the site DB.</li>
            <li>Connected device is saved in <code>localStorage</code> only for demo convenience — the worker/API also records a connection entry.</li>
            <li>If you want to disconnect, click the <strong>❌</strong> button next to Connect.</li>
          </ol>
        </section>

        {/* STEP 3 CARD */}
        <section className="card">
          <h2>3. Add Switches (max 5 for demo)</h2>
          <ol className="steps">
            <li>In <strong>Profile → Switches</strong> enter a label (e.g. <em>Room Light</em>) and click <strong>Add Switch</strong>.</li>
            <li>Each label is unique per user. The API enforces up to 5 switches per user.</li>
            <li>New switch default state: <code>off</code>. You can toggle it after creation.</li>
          </ol>
        </section>

        {/* STEP 4 CARD */}
        <section className="card">
          <h2>4. Turn On / Off — How it works</h2>
          <ol className="steps">
            <li>
              Click the <strong>Turn On</strong> / <strong>Turn Off</strong> button next to a switch. The UI updates the state and calls your API:
            </li>
            <li>
              That API updates the database. For demo mode there is no direct hardware control until an actual ESP device polls the server or implement Websocket(see Polling section).
            </li>
            <li>
              If disconnecting device fails, then go to browsers settings &gt; site settings &gt; data stored &gt; delete "https://schedulers.pages.dev" or clear browser's data :).
            </li>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <li style={{ color: 'red', listStyleType: 'none' }}>
                After Cloudflare workers conversion, websocket will be implemented.
              </li>
            </div>
          </ol>
        </section>

        {/* STEP 5 CARD */}
        <section className="card">
          <h2>5. Rename &amp; Remove</h2>
          <ol className="steps">
            <li>Click <strong>Rename</strong> — edit inline then blur to save the new label. This calls the API with <code>renameTo</code>.</li>
            <li>Click <strong>Remove</strong> to delete the switch from your account (DELETE /api/esp).</li>
            <li>Removed switches are deleted from the DB. They will no longer appear for your account.</li>
          </ol>
        </section>

        {/* STEP 6 CARD */}
        <section className="card">
          <h2>6. Polling (Demo → How the ESP reads commands)</h2>
          <ol className="steps">
            <li><strong>Polling</strong> means the ESP device periodically asks your server, “Any commands for me?” (example interval: <em>30s</em> for demo).</li>
            <li>Polling works when the ESP is on the Internet (has Wi-Fi / SIM / NAT/port open depending on your setup). If the ESP is only on local network and not reachable, it cannot poll remotely.</li>
            <li>When the ESP polls, your server can return the desired pin state for each labeled switch and the ESP applies it to the GPIO pins.</li>
            <li><strong>Important (demo):</strong> Polling consumes simple HTTP requests; if you set very short intervals and many devices, you can hit Cloudflare Pages/Workers request/build limits. For a demo, 30s is reasonable.</li>
          </ol>
        </section>

        {/* STEP 7 CARD */}
        <section className="card">
          <h2>7. Quick Troubleshooting</h2>
          <ul className="steps">
            <li>If switches aren't changing on the device, make sure the ESP is connected to the Internet and polling the API URL.</li>
            <li>If device shows “Not connected”, reconnect from the Profile → Devices box.</li>
            <li>Check browser console for API errors; your endpoints return helpful JSON messages.</li>
          </ul>
        </section>

        {/* ABOUT BOTTOM SECTION */}
        <section className="card about" id="about-section">
          <h2>About this Demo</h2>
          <p>This project is a lightweight demo to show how a web app can manage labeled switches, set timers, and control remote devices. It is intended for demonstrations and learning — As real polling, websocket etc will induce charges.</p>
        </section>

        <footer className="small-footer">
          <p>
            Need more? See <Link to="/privacy">Privacy Policy</Link> or return <Link to="/">Home</Link>.
          </p>
        </footer>
      </main>
    </>
  );
}
