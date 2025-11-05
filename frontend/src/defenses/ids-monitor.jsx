import React, { useState } from 'react'
import '../App.css'

export default function IDSMonitor() {
  const [alerts, setAlerts] = useState([
    { id: 1, time: 'Nov 04 10:12', src: '10.0.0.5', type: 'Brute Force', details: 'Multiple failed ssh login attempts' },
    { id: 2, time: 'Nov 04 11:02', src: '10.0.0.9', type: 'Port Scan', details: 'SYN scan observed on multiple ports' },
    { id: 3, time: 'Nov 04 11:45', src: '10.0.0.8', type: 'Suspicious Login', details: 'Login from atypical region' },
  ])
  const [filter, setFilter] = useState('')

  function dismiss(id) {
    setAlerts(a => a.filter(x => x.id !== id))
  }

  const shown = alerts.filter(a => (filter ? JSON.stringify(a).toLowerCase().includes(filter.toLowerCase()) : true))

  return (
  <div className="defense-container session-layout session-column">
      <aside className="session-title">
        <h1>IDS Monitor — Alerts</h1>
        <p>A tiny simulated IDS dashboard. Filter alerts and dismiss them as you triage.</p>
      </aside>

      <main className="session-main">
        <div className="panel">
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={filter} onChange={(e)=>setFilter(e.target.value)} className="atk-input" placeholder="filter alerts" />
            <button className="btn" onClick={()=>setFilter('')}>Clear</button>
          </div>

          {shown.length === 0 ? <div style={{ color: '#94a3b8' }}>No alerts</div> : shown.map(a => (
            <div key={a.id} style={{ padding: 10, borderRadius: 6, marginBottom: 8, background:'#071018' }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <strong style={{ color: '#fff' }}>{a.type}</strong>
                <small style={{ color: '#94a3b8' }}>{a.time} • {a.src}</small>
              </div>
              <div style={{ color: '#cbd5e1', marginTop:6 }}>{a.details}</div>
              <div style={{ marginTop:8, display:'flex', gap:8 }}>
                <button className="btn" onClick={()=>dismiss(a.id)}>Dismiss</button>
                <button className="btn ghost">Investigate</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <aside className="status-panel">
        <h4>Quick actions</h4>
        <button className="btn" onClick={()=>setAlerts(a => [{ id: Date.now(), time: 'Now', src: '10.0.0.99', type: 'New Alert', details: 'Simulated incoming alert' }, ...a])}>Simulate Alert</button>
        <div style={{ marginTop: 12 }}>
          <h4>Tips</h4>
          <div style={{ color:'#cbd5e1' }}>Use the filter to find IPs or alert types. Dismiss false positives during triage.</div>
        </div>
      </aside>
    </div>
  )
}
