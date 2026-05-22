
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all CSS files to ensure styles apply globally
import './styles/style.css';
import './styles/index.css';
import './styles/forgot.css';
import './styles/privacy.css';
import './styles/profile.css';
/*import './styles/sell.css';*/
import './styles/signup.css';
import './styles/switches.css';
import './styles/use.css';

// Import all Components
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import Privacy from './components/Privacy';
/*import ProductDetails from './components/ProductDetails';*/
import Profile from './components/Profile';
/*import Sell from './components/Sell';*/
import Signup from './components/Signup';
import Use from './components/Use';

// Optional: Import your old script.js if it contains global logic
// import './script.js';

function App() {
  // If your script.js relies on DOM elements being loaded, 
  // you can safely trigger or import side-effects here.
  useEffect(() => {
    console.log("App successfully mounted with all styles and components.");
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/use" element={<Use />} />

        {/* Fallback Aliases so your old .html links don't throw 404 errors */}
        <Route path="/index.html" element={<Home />} />
        <Route path="/dashboard.html" element={<Dashboard />} />
        <Route path="/forgot-password.html" element={<ForgotPassword />} />
        <Route path="/privacy.html" element={<Privacy />} />
        <Route path="/profile.html" element={<Profile />} />
        <Route path="/signup.html" element={<Signup />} />
        <Route path="/use.html" element={<Use />} />
      </Routes>
    </Router>
  );
}

export default App;
