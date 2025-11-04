import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Learn() {
  const navigate = useNavigate();

  return (
    <div className="learn-container">
      <h1>Choose Your Training Path</h1>
      <div className="path-options">
        <div 
          className="path-card" 
          onClick={() => navigate('/attack')}
        >
          <h2>Attack</h2>
          <p>Learn offensive security techniques and penetration testing</p>
          <button className="btn primary">Start Attack Training</button>
        </div>
        <div 
          className="path-card"
          onClick={() => navigate('/defense')}
        >
          <h2>Defense</h2>
          <p>Learn defensive security practices and system hardening</p>
          <button className="btn primary">Start Defense Training</button>
        </div>
      </div>
    </div>
  );
}

export default Learn;
