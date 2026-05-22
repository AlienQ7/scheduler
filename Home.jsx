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
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsDrawerOpen(false);
  };

  // --- Login Form Submit ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email: cleanEmail, password: cleanPassword }),
      });
      
      const data = await res.json();
      if (!res.ok) return alert(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('Login successful!');
      setIsLoggedIn(true);
      setIsModalOpen(false);
      
      setEmail('');
      setPassword('');

      navigate('/profile');
    } catch (err) {
      alert('Network error during login.');
    }
  };

  return (
    <div className="bg-dark text-light min-vh-100 d-flex flex-column">
      
      {/* ===================== HEADER & NAVIGATION ===================== */}
      <nav className="navbar navbar-dark bg-black border-bottom border-secondary px-3 py-2 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="navbar-brand fs-3 fw-bold tracking-wide m-0">
            <span style={{ color: '#fff' }}>Sche</span>
            <span style={{ color: '#00ffcc' }}>Duler</span>
          </span>
          <button 
            className="btn btn-outline-info border-2" 
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Toggle navigation menu"
          >
            &#9776;
          </button>
        </div>
      </nav>

      {/* ===================== BOOTSTRAP OFF-CANVAS SIDE DRAWER ===================== */}
      <div 
        className={`offcanvas offcanvas-end bg-black text-light border-start border-secondary ${isDrawerOpen ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: isDrawerOpen ? 'visible' : 'hidden', zIndex: 1055 }}
      >
        <div className="offcanvas-header justify-content-between align-items-center px-4 pt-4 pb-2">
          <h3 className="offcanvas-title text-center w-100 fw-bold border-bottom border-dark pb-2" style={{ color: '#00ffcc' }}>
            User Menu
          </h3>
          <button 
            type="button" 
            className="btn-close btn-close-white align-self-start position-absolute end-0 top-0 m-3" 
            onClick={() => setIsDrawerOpen(false)}
          ></button>
        </div>
        <div className="offcanvas-body px-4">
          <ul className="nav flex-column gap-3 fs-5">
            {!isLoggedIn ? (
              <li className="nav-item">
                <button 
                  onClick={() => { setIsDrawerOpen(false); setIsModalOpen(true); }}
                  className="btn btn-link text-start p-0 nav-link fw-semibold"
                  style={{ color: 'gold', textDecoration: 'none' }}
                >
                  🚀 Login
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-light p-0" onClick={() => setIsDrawerOpen(false)}>
                    👤 Profile Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-link text-start p-0 nav-link fw-semibold"
                    style={{ color: 'gold', textDecoration: 'none' }}
                  >
                    🔒 Logout
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link to="/use" className="nav-link text-light p-0" onClick={() => setIsDrawerOpen(false)}>📖 How to Use</Link>
            </li>
            <li className="nav-item">
              <a href="#about-section" className="nav-link text-light p-0" onClick={() => setIsDrawerOpen(false)}>💡 About</a>
            </li>
            <li className="nav-item">
              <Link to="/privacy" className="nav-link text-light p-0" onClick={() => setIsDrawerOpen(false)}>🛡️ Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay backdrop block for Off-canvas drawer */}
      {isDrawerOpen && (
        <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* ===================== MAIN CONTENT HERO SECTION ===================== */}
      <main className="container my-5 flex-grow-1 px-4">
        <section className="text-center py-4 mb-4">
          <h1 className="display-4 fw-bold" style={{ color: '#00ffcc' }}>
            Welcome to <span style={{ color: '#00ffff' }}>ScheDuler IoT Control</span>
          </h1>
          <p className="lead mx-auto text-secondary" style={{ maxWidth: '700px' }}>
            Your <span style={{ color: '#00ffff' }}>secure</span>, <span style={{ color: '#00ffff' }}>centralized</span> platform for managing connected microcontrollers.
          </p>
          <div className="mt-4">
            <p className="fw-bold p-3 bg-dark border border-danger rounded d-inline-block text-danger" style={{ letterSpacing: '0.5px' }}>
              ⚠️ (Do not Enter <span style={{ color: '#00ffff' }}>Real Info</span> <span style={{ color: '#00ffff' }}>as it's a</span> demo project.)
            </p>
          </div>
        </section>

        {/* Dynamic Action Callout Block */}
        {!isLoggedIn && (
          <section className="text-center my-5">
            <button 
              className="btn btn-info btn-lg fw-bold shadow text-black px-5 py-3 border-2" 
              style={{ borderRadius: '30px' }}
              onClick={() => setIsModalOpen(true)}
            >
              Start Controlling Your Devices (Login)
            </button>
          </section>
        )}

        {/* ===================== RESPONSIVE BOOTSTRAP GRID ===================== */}
        <section className="row g-4 mt-2">
          
          {/* Card 1 */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 bg-black text-light border border-secondary shadow-sm p-3">
              <div className="card-body">
                <h3 className="card-title h4 mb-3" style={{ color: '#00ffcc' }}>💡 What is IoT?</h3>
                <p className="card-text text-secondary" style={{ lineHeight: '1.6' }}>
                  The <b style={{ color: '#00ffff' }}>Internet of Things (IoT)</b> connects physical devices — sensors, switches, and machines — to the internet.  
                  It allows them to collect, send, and act on data without human intervention.  
                  This makes systems more <b style={{ color: '#00ffff' }}>efficient, responsive,</b> and <b style={{ color: '#00ffff' }}>automated</b>.  
                  ScheDuler IoT bridges that gap, letting you control your hardware directly from your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 bg-black text-light border border-secondary shadow-sm p-3">
              <div className="card-body">
                <h3 className="card-title h4 mb-3" style={{ color: '#00ffcc' }}>⚙️ Key Functions</h3>
                <ul className="list-unstyled d-flex flex-column gap-2 text-secondary" style={{ paddingLeft: '0' }}>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Real-Time Monitoring:</b> Instantly view live device status updates.</li>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Remote Control:</b> Toggle switches <b>on/off</b> globally from anywhere.</li>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Security:</b> Sessions protected with secure <b>token-based authentication</b>.</li>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Profile Hub:</b> Organize local device groups and automate your scripts.</li>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Recovery System:</b> Safe <b>password resets</b> via matching encryption codes.</li>
                  <li>🚀 <b style={{ color: '#00ffff' }}>Free &amp; Open:</b> Unlimited mock switches and connectivity endpoints.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-12 col-lg-4" id="about-section">
            <div className="card h-100 bg-black text-light border border-secondary shadow-sm p-3">
              <div className="card-body">
                <h3 className="card-title h4 mb-3" style={{ color: '#00ffcc' }}>📘 About This Project</h3>
                <p className="card-text text-secondary mb-3" style={{ lineHeight: '1.6' }}>
                  <b style={{ color: '#00ffff' }}>ScheDuler</b> is a lightweight web application combining a responsive frontend with high-performance <b style={{ color: '#00ffff' }}>Cloudflare serverless API workers</b> and <b style={{ color: '#00ffff' }}>ESP-based devices</b> for real-time electrical grid management.
                </p>
                <p className="card-text small text-muted border-top border-dark pt-3">
                  <b style={{ color: '#00ffff' }}>How to use:</b> Simply sign up for a demo profile, log in, configure an environment cluster, and test live polling configurations safely.
                </p>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-black border-top border-secondary text-center text-secondary py-4 mt-auto">
        <div className="container">
          <p className="mb-2">
            <a href="#about-section" className="text-warning text-decoration-none mx-2">About</a> |{' '}
            <a href="#" className="text-warning text-decoration-none mx-2">Some List</a>
          </p>
          <p className="small m-0">&copy; 2026 Scheduler IoT. All Rights Reserved.</p>
        </div>
      </footer>

      {/* ===================== LIGHTWEIGHT AUTHENTICATION MODAL ===================== */}
      {isModalOpen && (
        <div 
          className="modal fade show d-flex align-items-center justify-content-center" 
          style={{ display: 'block', background: 'rgba(0,0,0,0.8)', zIndex: 1050 }}
          onClick={(e) => e.target.style.background && setIsModalOpen(false)}
        >
          <div className="modal-dialog w-100 m-3" style={{ maxWidth: '440px' }}>
            <div className="modal-content bg-black text-light border border-secondary p-4 shadow-lg rounded-3 position-relative">
              
              <button 
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-3 fs-5 shadow-none"
                onClick={() => setIsModalOpen(false)}
              ></button>

              <h2 className="h3 text-center fw-bold mb-4" style={{ color: '#00ffcc' }}>
                Account Sign In
              </h2>

              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label small text-secondary fw-semibold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control bg-dark text-light border-secondary shadow-none p-2.5" 
                    placeholder="name@domain.com"
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small text-secondary fw-semibold">Password</label>
                  <div className="input-group">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="form-control bg-dark text-light border-secondary border-end-0 shadow-none p-2.5" 
                      placeholder="Enter password"
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-secondary bg-dark text-secondary border-secondary border-start-0 px-3" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '🔍︎'}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-info w-100 fw-bold py-2 mb-3 text-black">
                  Sign In
                </button>
              </form>

              <div className="text-center small mt-2">
                <p className="mb-1">
                  <Link to="/forgot-password" style={{ color: '#00ffff', textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </p>
                <p className="m-0 text-muted">
                  Don’t have an account?{' '}
                  <Link to="/signup" style={{ color: '#00ffff', textDecoration: 'none', fontWeight: 'bold' }}>
                    Sign up
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
