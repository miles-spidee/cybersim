import React from 'react';

function Defense() {
  return (
    <div className="defense-container">
      <h2>Defense Training</h2>
      <div className="training-options">
        <div className="training-card">
          <h3>Network Defense</h3>
          <p>Learn how to secure networks and defend against attacks</p>
          <button className="btn primary">Start Learning</button>
        </div>
        <div className="training-card">
          <h3>System Hardening</h3>
          <p>Secure systems and prevent unauthorized access</p>
          <button className="btn primary">Start Learning</button>
        </div>
      </div>
    </div>
  );
}

export default Defense;
