import React, { useState } from "react";
import "../App.css";

export default function LogAnalysis() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const logs = [
    "Nov 04 10:01:12 sshd[1234]: Failed password for invalid user admin from 10.0.0.5 port 40222",
    "Nov 04 10:03:44 systemd[1]: Started nginx service",
    "Nov 04 10:05:02 postgres[200]: ERROR Database connection failed at auth handshake",
    "Nov 04 10:07:11 app[200]: INFO User login: alice (10.0.0.11)",
    "Nov 04 10:09:33 sshd[1236]: Accepted password for user bob from 185.244.12.91 port 50222",
    "Nov 04 10:15:22 webapp[451]: WARNING Slow response detected for /login route",
    "Nov 04 10:18:07 firewall: BLOCK outbound connection attempt to 45.12.221.8 on port 4444"
  ];

  function runQuery(e) {
    e?.preventDefault();
    if (!query) return;
    setResults(logs.filter(l => l.toLowerCase().includes(query.toLowerCase())));
  }

  function highlight(text, q) {
    if (!q) return text;
    const regex = new RegExp(`(${q})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? <span key={i} style={{ background:"#ffca28", color:"#000" }}>{part}</span> : part
    );
  }

  return (
    <div className="defense-container session-layout session-column">
      <aside className="session-title">
        <h1>Log Analysis Console</h1>
        <p>Search logs for security-relevant signals, anomalies, user behavior and authentication patterns.</p>
      </aside>

      <main className="session-main">
        <div className="panel">
          <form onSubmit={runQuery} style={{ display:"flex", gap:8 }}>
            <input value={query} onChange={(e)=>setQuery(e.target.value)} className="atk-input" placeholder="Search logs: sshd, ERROR, IP, username, etc..." />
            <button className="btn" type="submit">Search</button>
          </form>

          <div style={{ marginTop: 12 }} className="results-panel">
            <h4>Results</h4>
            {results.length === 0 ? (
              <div style={{ color:"#94a3b8" }}>No results yet.</div>
            ) : (
              results.map((r,i)=>(
                <pre key={i} style={{ background:"#071018", padding:8, borderRadius:6, lineHeight:"1.4em" }}>{highlight(r, query)}</pre>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
