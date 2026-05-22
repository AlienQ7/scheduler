import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // --- React States ---
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);

  // Form States
  const [adTitle, setAdTitle] = useState('');
  const [adCategory, setAdCategory] = useState('');
  const [adLocation, setAdLocation] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adContact, setAdContact] = useState('');

  // --- Initial Mount Data Fetching ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.id) {
        fetchUserAds(parsedUser.id);
      } else {
        setIsLoadingAds(false);
      }
    } else {
      setIsLoadingAds(false);
    }
  }, []);

  // --- Fetch User Ads Function (Replaces script.js logic) ---
  const fetchUserAds = async (userId) => {
    try {
      setIsLoadingAds(true);
      // Calls your Cloudflare Functions endpoint /api/ads
      const res = await fetch(`/api/ads?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setAds(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to load ads from API.');
      }
    } catch (err) {
      console.error('Network error fetching ads:', err);
    } finally {
      setIsLoadingAds(false);
    }
  };

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // --- Submit New Ad Form ---
  const handleAddAdSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first.');

    const payload = {
      title: adTitle,
      category: adCategory,
      location: adLocation,
      description: adDescription,
      contact: adContact,
      email: user.email,
      user_id: user.id,
    };

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Ad posted successfully!');
        
        // Reset Form Inputs
        setAdTitle('');
        setAdCategory('');
        setAdLocation('');
        setAdDescription('');
        setAdContact('');

        // Refresh the list
        fetchUserAds(user.id);
      } else {
        alert('Failed to post ad.');
      }
    } catch (err) {
      alert('Network error, please try again later.');
    }
  };

  return (
    <>
      {/* ===================== HEADER ===================== */}
      <header className="header-bar">
        <div className="rank-display">
          <span className="rank-label">Naga</span>
          <span className="rank-title">DataLink</span>
        </div>
        <div className="header-menu">
          {!user ? (
            <button className="hamburger-btn" onClick={() => navigate('/')}>
              Login
            </button>
          ) : (
            <button className="hamburger-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      {/* ===================== MAIN CONTAINER ===================== */}
      <main className="container">
        {/* Profile Details Block */}
        <section className="profile-container">
          <h2>Welcome, <span>{user ? user.name || 'User' : 'Guest'}</span></h2>
          <p>Email: <span>{user ? user.email || '-' : '-'}</span></p>
          {user && (
            <Link to="/profile" className="menu-shop-link">
              View / Edit Profile
            </Link>
          )}
        </section>

        {/* Ads Manager Section */}
        <section className="task-manager">
          <h2>My Ads</h2>
          <div className="ads-container">
            {!user ? (
              <p className="stats-line">
                Please <Link to="/" style={{ color: 'var(--color-accent)' }}>login</Link> to view your ads.
              </p>
            ) : isLoadingAds ? (
              <p>Loading your ads...</p>
            ) : ads.length === 0 ? (
              <p>You haven't posted any ads yet.</p>
            ) : (
              // Map through array of active ads dynamically
              ads.map((ad, idx) => (
                <div key={ad.id || idx} className="ad-card" style={{ borderBottom: '1px solid #333', padding: '10px 0' }}>
                  <h4>{ad.title}</h4>
                  <p><small><b>Category:</b> {ad.category} | <b>Location:</b> {ad.location}</small></p>
                  <p>{ad.description}</p>
                  <p><small><b>Contact:</b> {ad.contact}</small></p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Post Form Block (Visible only if authenticated) */}
        {user && (
          <section className="auth-container">
            <h2>Post a New Ad</h2>
            <form onSubmit={handleAddAdSubmit}>
              <input
                type="text"
                placeholder="Ad Title"
                required
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Category"
                required
                value={adCategory}
                onChange={(e) => setAdCategory(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                required
                value={adLocation}
                onChange={(e) => setAdLocation(e.target.value)}
              />
              <textarea
                placeholder="Description"
                rows="3"
                required
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
              ></textarea>
              <input
                type="text"
                placeholder="Contact Info"
                required
                value={adContact}
                onChange={(e) => setAdContact(e.target.value)}
              />
              <button type="submit">Add Ad</button>
            </form>
          </section>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="footer">
        <p>&copy; 2025 NagaDataLink</p>
      </footer>
    </>
  );
}
