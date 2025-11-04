import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

export default function DefensesList() {
  const defenses = [
    { id: 'system-hardening', title: 'System Hardening', desc: 'Interactive checklist and terminal to practice basic hardening tasks.' },
  { id: 'log-analysis', title: 'Log Analysis', desc: 'Search and analyze simulated system logs for anomalies.' },
  { id: 'ids-monitor', title: 'IDS Monitor', desc: 'Simulated IDS alerts dashboard for triage practice.' },
    // add more defense sessions here
  ]

  return (
    <div className="defense-container">
      <h1>Available Defense Sessions</h1>
      <div className="path-options">
        {defenses.map(d => (
          <div key={d.id} className="path-card">
            <h2>{d.title}</h2>
            <p>{d.desc}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to={`/defense/${d.id}`} className="btn primary">Open</Link>
              <Link to="/learn" className="btn ghost">Back</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
