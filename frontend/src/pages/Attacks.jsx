import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

export default function AttacksList() {
  const attacks = [
  { id: 'sql-injection', title: 'SQL Injection', desc: 'A simple boolean-based SQL injection demo.' },
  { id: 'atk2', title: 'File Read Demo', desc: 'Simulated file-download endpoint (client-side demo).' },
  { id: 'atk3', title: 'Reflected XSS Demo', desc: 'Client-side reflected XSS simulation (safe).' },
  { id: 'atk4', title: 'Mini CTF Terminal', desc: 'Small CTF-style Linux command practice (simulated).' },
  { id: 'atk5', title: 'Traversal CTF', desc: 'Find a hidden file in a simulated filesystem (safe).' },
    // future attacks can be appended here
  ]

  return (
    <div className="learn-container">
      <h1>Available Attacks</h1>
      <div className="path-options">
        {attacks.map(a => (
          <div key={a.id} className="path-card">
            <h2>{a.title}</h2>
            <p>{a.desc}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/attack/${a.id}`} className="btn primary">Open</Link>
              <Link to="/learn" className="btn ghost">Back</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
