import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  // --- Form Inputs State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- UI Password Visibility States ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Success Modal State ---
  const [recoveryCode, setRecoveryCode] = useState(null); // When set to a string, the popup appears

  // --- Signup Submit Handler ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('❌ Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      alert('❌ Password must be at least 8 characters long!');
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      console.log('Signup response:', data);

      if (res.ok) {
        // Triggers the conditional popup mask modal
        setRecoveryCode(data.recovery_code);
      } else {
        alert('❌ ' + (data.error || 'Signup failed'));
      }
    } catch (err) {
      alert('⚠️ Network error during registration.');
    }
  };

  // --- Modal Close Handler ---
  const handleModalClose = () => {
    setRecoveryCode(null);
    navigate('/profile'); // Redirects smoothly into your new router structure
  };

  return (
    <>
      <div className="login_email">
        <div className="email_login">
          {/* Close button navigating to root index */}
          <span className="close__btn" onClick={() => navigate('/')}>
            &times;
          </span>
          <h1>Create Account</h1>
          <p>Enter your details to create a new account.</p>

          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input block */}
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password(8 character)"
                required
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

            {/* Confirm password input block */}
            <div className="password-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '🔍︎'}
              </span>
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#4af' }}>
              <b>Login</b>
            </Link>
          </p>
        </div>
      </div>

      {/* ===================== SIGNUP SUCCESS ALERT MASK MODAL ===================== */}
      {recoveryCode && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: '#111',
              color: '#fff',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '420px',
              width: 'min(92%, 420px)',
              boxShadow:
                '0 10px 30px rgba(0,0,0,0.6), 0 0 32px rgba(0,255,34,0.12), 0 0 6px rgba(0,255,34,0.18)',
            }}
          >
            <h3 style={{ margin: '0 0 6px 0', fontWeight: 700, letterSpacing: '0.6px', fontSize: '1.2rem' }}>
              ✅ Signup Successful!
            </h3>
            <p style={{ margin: '0 0 12px 0', color: '#ccc', fontSize: '0.95rem' }}>Your recovery code:</p>

            <pre
              style={{
                background: '#222',
                color: '#0f0',
                padding: '10px',
                borderRadius: '8px',
                userSelect: 'text',
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                margin: '0 0 14px 0',
                fontWeight: 700,
                letterSpacing: '0.6px',
                fontFamily: 'monospace',
              }}
            >
              {recoveryCode}
            </pre>

            <small style={{ display: 'block', marginbottom: '14px', color: '#ccc' }}>
              Copy and keep this code safe for future resets.
            </small>

            <button
              onClick={handleModalClose}
              style={{
                background: '#0f0',
                color: '#000',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 800,
                width: '70%',
                maxWidth: '260px',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
