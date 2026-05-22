import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  // --- Auth & User State ---
  const [token, setToken] = useState('');
  const [userPayload, setUserPayload] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  // --- Dropdown State ---
  const [showDropdown, setShowDropdown] = useState(false);

  // --- Device Management States ---
  const [deviceName, setDeviceName] = useState('');
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  // --- Switch Management States ---
  const [newSwitchLabel, setNewSwitchLabel] = useState('');
  const [switches, setSwitches] = useState([]);
  const [isLoadingSwitches, setIsLoadingSwitches] = useState(true);
  const [editingSwitchId, setEditingSwitchId] = useState(null); // Track which row is being renamed
  const [editLabelValue, setEditLabelValue] = useState('');

  // --- JWT Decoder Helper ---
  const decodeJWT = (tokenStr) => {
    try {
      return JSON.parse(atob(tokenStr.split('.')[1]));
    } catch {
      return null;
    }
  };

  // --- Initial Auth Check & Mount Lifecycle ---
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/');
      return;
    }

    const decoded = decodeJWT(storedToken);
    if (!decoded || Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      navigate('/');
      return;
    }

    setToken(storedToken);
    setUserPayload(decoded);

    // Sync saved connected device
    const savedDevice = localStorage.getItem('connectedDevice');
    if (savedDevice) {
      setDeviceName(savedDevice);
      setIsDeviceConnected(true);
    }

    // Load active dashboard switches
    loadSwitches(decoded.email, storedToken);

    // Global listener to close dropdown when clicking outside
    const closeDropdownOutside = (e) => {
      if (!e.target.closest('.menu-wrapper')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', closeDropdownOutside);
    return () => document.removeEventListener('click', closeDropdownOutside);
  }, [navigate]);

  // --- Fetch Switches ---
  const loadSwitches = async (email, activeToken) => {
    try {
      setIsLoadingSwitches(true);
      const res = await fetch(`/api/esp?email=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      const data = await res.json();
      setSwitches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load switches:', err);
    } finally {
      setIsLoadingSwitches(false);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // --- Delete Account ---
  const handleDeleteAccount = async () => {
    const confirmDel = confirm('⚠️ Are you sure you want to delete your account? This cannot be undone!');
    if (!confirmDel) return;
    try {
      const res = await fetch('/api/auth?action=delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email }),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Your account has been deleted successfully.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert('❌ Failed to delete account: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('⚠️ Error deleting account. Please try again later.');
    }
  };

  // --- Connect Device ---
  const handleConnectDevice = async () => {
    if (!deviceName.trim()) return alert('Please enter a device name or IP!');
    try {
      const res = await fetch('/api/esp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email, device: deviceName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('connectedDevice', deviceName.trim());
        setIsDeviceConnected(true);
      } else {
        alert('❌ Connection failed: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('⚠️ Connection error.');
    }
  };

  // --- Disconnect Device ---
  const handleDisconnectDevice = async () => {
    const targetDevice = deviceName.trim() || localStorage.getItem('connectedDevice');
    if (!targetDevice) return alert('Please enter a device name or IP!');
    try {
      const res = await fetch('/api/esp', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email, device: targetDevice })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem('connectedDevice');
        setIsDeviceConnected(false);
        setDeviceName('');
        alert('✅ Device disconnected successfully!');
      } else {
        alert('❌ Failed to disconnect: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('⚠️ Error disconnecting device.');
    }
  };

  // --- Add New Switch ---
  const handleAddSwitch = async () => {
    const label = newSwitchLabel.trim();
    if (!label) return;
    try {
      const res = await fetch('/api/esp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email, label, state: 'off' })
      });
      const data = await res.json();
      if (data.success) {
        setNewSwitchLabel('');
        loadSwitches(userPayload.email, token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Toggle Switch State (On / Off) ---
  const handleToggleSwitch = async (label, currentEvtState) => {
    const newState = currentEvtState === 'on' ? 'off' : 'on';
    try {
      const res = await fetch('/api/esp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email, label, state: newState })
      });
      const data = await res.json();
      if (data.success) {
        setSwitches(switches.map(sw => sw.label === label ? { ...sw, state: newState } : sw));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Remove Switch ---
  const handleRemoveSwitch = async (label) => {
    try {
      const res = await fetch('/api/esp', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: userPayload.email, label })
      });
      const data = await res.json();
      if (data.success) {
        setSwitches(switches.filter(sw => sw.label !== label));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Complete Switch Rename (Blur Action) ---
  const handleRenameBlur = async (oldLabel) => {
    const newLabel = editLabelValue.trim();
    if (newLabel && newLabel !== oldLabel) {
      try {
        const res = await fetch('/api/esp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ email: userPayload.email, label: oldLabel, renameTo: newLabel })
        });
        const data = await res.json();
        if (data.success) {
          setSwitches(switches.map(sw => sw.label === oldLabel ? { ...sw, label: newLabel } : sw));
        }
      } catch (err) {
        console.error(err);
      }
    }
    setEditingSwitchId(null);
  };

  return (
    <>
      {/* ===================== HEADER ===================== */}
      <header className="header-bar">
        <div className="rank-display">
          <span className="rank-label">Sche</span>
          <span className="rank-title">Duler</span>
        </div>

        <div className="menu-wrapper" style={{ position: 'relative' }}>
          <button 
            className="hamburger-icon" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            &#9776;
          </button>
          
          <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
            <Link to="/">Home</Link>
            <Link to="/#about-section">About</Link>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleDeleteAccount} style={{ color: 'red' }}>
              Delete Account
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MAIN PROFILE AREA ===================== */}
      <main>
        <div className="profile-card">
          <h2>Profile</h2>
          <p><strong>Name:</strong> <span>{userPayload ? userPayload.name || 'User' : '-'}</span></p>
          <p>
            <strong>Email:</strong>
            {showEmail && <span style={{ marginRight: '8px' }}>{userPayload ? userPayload.email : '-'}</span>}
            <button 
              className="view-btn" 
              onClick={() => setShowEmail(!showEmail)}
            >
              {showEmail ? 'Hide' : 'View'}
            </button>
          </p>
        </div>

        <div className="profile-actions">
          <Link to="/">Back to Home</Link>
        </div>

        {/* DEVICE CONNECTION CONTROLLER */}
        <section id="deviceSection">
          <h2>Devices</h2>
          <div className="add-device-box">
            <input 
              type="text" 
              placeholder="Enter device name or IP"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              disabled={isDeviceConnected}
            />
            {!isDeviceConnected ? (
              <button 
                className="action-small" 
                onClick={handleConnectDevice}
              >
                Connect
              </button>
            ) : (
              <button 
                className="action-small" 
                style={{ backgroundColor: 'gold', color: 'black' }}
                disabled
              >
                Connected ✅
              </button>
            )}
            {isDeviceConnected && (
              <button 
                className="action-small" 
                style={{ backgroundColor: 'gold', color: 'black', marginLeft: '5px' }}
                onClick={handleDisconnectDevice}
              >
                ❌
              </button>
            )}
          </div>
        </section>

        {/* IOT SWITCH CONTROL PANEL */}
        <section id="myAds">
          <h2>Switches</h2>

          <div className="add-switch-box">
            <input 
              type="text" 
              placeholder="Enter switch label (max 5)" 
              maxLength={30}
              value={newSwitchLabel}
              onChange={(e) => setNewSwitchLabel(e.target.value)}
            />
            <button className="action-small" onClick={handleAddSwitch}>
              Add Switch
            </button>
          </div>

          <div id="userAds">
            {isLoadingSwitches ? (
              <p>Loading your switches...</p>
            ) : switches.length === 0 ? (
              <p>No switches yet. Add one above.</p>
            ) : (
              // Map rendering dynamically loop layout row
              switches.map((sw, index) => (
                <div key={sw.id || index} className="switch-row">
                  <div className="switch-info">
                    {editingSwitchId === (sw.id || index) ? (
                      <input
                        type="text"
                        value={editLabelValue}
                        maxLength={30}
                        autoFocus
                        onChange={(e) => setEditLabelValue(e.target.value)}
                        onBlur={() => handleRenameBlur(sw.label)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameBlur(sw.label)}
                      />
                    ) : (
                      <strong className="switch-label">{sw.label}</strong>
                    )}
                    <small className="switch-ts">{sw.timestamp || ''}</small>
                  </div>
                  
                  <div className="switch-actions">
                    <button 
                      className="toggle-btn" 
                      onClick={() => handleToggleSwitch(sw.label, sw.state)}
                    >
                      {sw.state === 'on' ? 'Turn Off' : 'Turn On'}
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setEditingSwitchId(sw.id || index);
                        setEditLabelValue(sw.label);
                      }}
                    >
                      Rename
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveSwitch(sw.label)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
