import React, { useState } from 'react'
import '../App.css'

export default function LogAnalysis() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // simulated logs
  const logs = [
    'Nov 04 10:01:12 sshd[1234]: Failed password for invalid user admin from 10.0.0.5 port 40222',
    'Nov 04 10:03:44 systemd[1]: Started nginx service',
    'Nov 04 10:05:02 app[200]: ERROR Database connection failed',
    'Nov 04 10:07:11 app[200]: INFO User login: alice',
    'Nov 04 10:09:33 sshd[1236]: Accepted password for user bob from 10.0.0.8 port 50222',
  ]

  function runQuery(e) {
    e?.preventDefault()
    if (!query) return
    const out = logs.filter(l => l.toLowerCase().includes(query.toLowerCase()))
    setResults(out)
  }

  return (
  <div className="defense-container session-layout session-column">
      <aside className="session-title">
        <h1>Log Analysis — Interactive</h1>
        <p>Search a small set of simulated system logs to find anomalies.</p>
      </aside>

      <main className="session-main">
        <div className="panel">
          <form onSubmit={runQuery} style={{ display: 'flex', gap: 8 }}>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} className="atk-input" placeholder="search text e.g. sshd, ERROR" />
            <button className="btn" type="submit">Search</button>
          </form>

          <div style={{ marginTop: 12 }} className="results-panel">
            <h4>Results</h4>
            {results.length === 0 ? <div style={{ color: '#94a3b8' }}>No results yet.</div> : results.map((r,i)=>(<pre key={i} style={{ background:'#071018', padding:8, borderRadius:6 }}>{r}</pre>))}
          </div>
        </div>
      </main>

      <aside className="status-panel">
        <h4>Quick actions</h4>
        <div style={{ marginTop: 8 }}>
          <div style={{ color: 'var(--muted)' }}>Use the search to look for events. Try keywords like <code>sshd</code> or <code>ERROR</code>.</div>
        </div>
      </aside>
    </div>
  )
}
