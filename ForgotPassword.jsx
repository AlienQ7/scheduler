import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();

  // --- Form Input States ---
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // --- UI Visibility States ---
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [newRecoveryCode, setNewRecoveryCode] = useState(null); // Holds new code for modal popup

  // --- Submit Handler ---
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      alert('❌ Passwords do not match!');
      return;
    }

    if (newPass.length < 8) {
      alert('❌ Password must be at least 8 characters long!');
      return;
    }

    try {
      const res = await fetch('/api/auth?action=forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          recovery_code: code.trim(),
          new_password: newPass.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Sets state instead of creating a DOM element; this opens our modal view
        setNewRecoveryCode(data.recovery_code);
      } else {
        alert('❌ ' + (data.error || 'Reset failed. Check your recovery code or try again.'));
      }
    } catch (err) {
      alert('⚠️ Network error: ' + err.message);
    }
  };

  // --- Close Success Modal and Redirect ---
  const handleModalClose = () => {
    setNewRecoveryCode(null);
    navigate('/');
  };

  return (
    <>
      <div className="login_email">
        <div className="email_login">
          {/* Close button uses React Router navigate instead of window.location */}
          <span className="close__btn" onClick={() => navigate('/')}>
            &times;
          </span>
          
          <h1>Reset Password</h1>
          <p>Enter your email, recovery code (the code shown when you signed up), and new password.</p>

          <form onSubmit={handleResetSubmit}>
            <input
              type="email"
              placeholder="Registered Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input
              type="text"
              placeholder="Recovery Code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {/* New Password Field */}
            <div className="password-container">
              <input
                type={showNewPass ? 'text' : 'password'}
                placeholder="New Password (min 8 chars)"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <span
                className="toggle-password"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? '🙈' : '🔍︎'}
              </span>
            </div>

            {/* Confirm New Password Field */}
            <div className="password-container">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="Confirm New Password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <span
                className="toggle-password"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? '🙈' : '🔍︎'}
              </span>
            </div>

            <button type="submit">Reset Password</button>
          </form>

          <p>
            Remembered? <Link to="/"><b>Go back to Login</b></Link>
          </p>
        </div>
      </div>

      {/* ===================== SUCCESS DIALOG POPUP MODAL ===================== */}
      {newRecoveryCode && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', zindex: 9999
        }}>
          <div style={{
            background: '#111', color: '#fff', padding: '20px', borderRadius: '10px',
            textAlign: 'center', maxWidth: '320px', width: '90%'
          }}>
            <h3>✅ Password Reset Successful!</h3>
            <p>Your new recovery code:</p>
            <pre style={{
              background: '#222', color: '#0f0', padding: '10px', borderRadius: '8px',
              userSelect: 'text', whiteSpace: 'pre-wrap', fontFamily: 'monospace'
            }}>
              {newRecoveryCode}
            </pre>
            <small>Copy and keep this code safe for future resets.</small>
            <br /><br />
            <button 
              onClick={handleModalClose}
              style={{
                background: '#0f0', color: '#000', border: 'none', padding: '8px 14px',
                borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
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
