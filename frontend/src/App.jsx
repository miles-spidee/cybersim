import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import SingleAttackSession from './attacks/atk1';
import Learn from './pages/Learn';
import Defense from './pages/Defense';



function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="top-nav">
      <div className="brand">
        <span className="brand-text">Cybersim</span>
      </div>
      <div className="nav-actions">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/get-started" className={`nav-link ${isActive('/get-started') ? 'active' : ''}`}>Get started</Link>
        <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>Articles</Link>
        <Link to="/learn" className={`nav-link ${location.pathname.startsWith('/learn') || 
                                          location.pathname.startsWith('/attack') || 
                                          location.pathname.startsWith('/defense') ? 'active' : ''}`}>
          Learn
        </Link>
        <Link to="/login" className="nav-link login">Log in</Link>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <main className="main-placeholder">
      <div className="card center-card">
        <h1>Welcome to Cybersim</h1>
        <p className="lead">A learning platform for cybersecurity — rebuilding the UI from scratch.</p>
        <div className="actions">
          <Link to="/get-started" className="btn primary">Get started</Link>
          <Link to="/learn" className="btn ghost">Learn more</Link>
        </div>
      </div>
      <section className="unique-features">
        <h2>Platform highlights</h2>
        <ul>
          <li>Interactive sandboxed labs</li>
          <li>Beginner → advanced CTF tracks</li>
          <li>Linux command games and exercises</li>
          <li>Step-by-step writeups and community guides</li>
        </ul>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div id="root">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route 
            path="/attack" 
            element={
              <main style={{ paddingTop: '1.25rem' }}>
                <SingleAttackSession onClose={() => window.location.href = '/'} />
              </main>
            } 
          />
          <Route path="/defense" element={<Defense />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
