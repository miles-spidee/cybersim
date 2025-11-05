import React, { useState, useEffect } from "react";
import "../App.css";

export default function IDSMonitor() {
  const [alerts, setAlerts] = useState([
    { id: 1, time: "Nov 04 10:12", src: "10.0.0.5", type: "Brute Force Authentication", severity: "High", details: "Detected 22 failed SSH login attempts within 45 seconds" },
    { id: 2, time: "Nov 04 11:02", src: "10.0.0.9", type: "TCP Port Scan", severity: "Medium", details: "SYN scan across sequential ports from host" },
    { id: 3, time: "Nov 04 11:45", src: "185.244.12.91", type: "Suspicious Geo-Login", severity: "Critical", details: "Login from foreign country to privileged account" },
  ]);

  const [filter, setFilter] = useState("");
  const [investigate, setInvestigate] = useState(null);

  // ---------- AUTO LIVE RANDOM ALERT SIMULATION ----------
  useEffect(() => {
    const interval = setInterval(() => {
      const severities = ["Low", "Medium", "High", "Critical"];
      const types = ["Brute Force", "SQL Injection", "XSS Attempt", "Unauthorized Access", "Malware Beaconing"];
      const ip = `10.0.0.${Math.floor(Math.random() * 200) + 1}`;
      const newAlert = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        src: ip,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        details: `Automated detection event logged involving host ${ip}`
      };
      setAlerts(a => [newAlert, ...a]);
    }, 12000); // new alert every 12s
    return () => clearInterval(interval);
  }, []);

  function dismiss(id) {
    setAlerts(a => a.filter(x => x.id !== id));
  }

  const shown = alerts.filter(a => (filter ? JSON.stringify(a).toLowerCase().includes(filter.toLowerCase()) : true));

  function severityColor(level) {
    return {
      "Critical": "#ff4d4f",
      "High": "#ff7a45",
      "Medium": "#faad14",
      "Low": "#4ade80"
    }[level] || "#94a3b8";
  }

  return (
    <div className="defense-container session-layout session-column">
      <aside className="session-title">
        <h1>IDS Monitor — Live Threat Feed</h1>
        <p>Real-time intrusion detection event viewer. Alerts update automatically.</p>
      </aside>

      <main className="session-main">
        <div className="panel">

          {/* Filter Bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={filter} onChange={(e)=>setFilter(e.target.value)} className="atk-input" placeholder="Filter alerts (ip, type, severity)"/>
            <button className="btn" onClick={()=>setFilter("")}>Clear</button>
          </div>

          {/* Alerts List */}
          {shown.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No alerts</div>
          ) : shown.map(a => (
            <div key={a.id} style={{ padding: 12, borderRadius: 6, marginBottom: 8, background:"#071018", border:`1px solid ${severityColor(a.severity)}` }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <strong style={{ color: severityColor(a.severity) }}>{a.type} ({a.severity})</strong>
                <small style={{ color:"#94a3b8" }}>{a.time} • {a.src}</small>
              </div>
              <div style={{ color:"#cbd5e1", marginTop:6 }}>{a.details}</div>
              <div style={{ marginTop:8, display:"flex", gap:8 }}>
                <button className="btn" onClick={()=>dismiss(a.id)}>Dismiss</button>
                <button className="btn ghost" onClick={()=>setInvestigate(a)}>Investigate</button>
              </div>
            </div>
          ))}

        </div>
      </main>

      {/* Investigation Modal */}
      {investigate && (
        <div className="modal">
          <div className="modal-content glass">
            <h2>Investigation Details</h2>
            <p><b>Source IP:</b> {investigate.src}</p>
            <p><b>Event:</b> {investigate.type}</p>
            <p><b>Severity:</b> {investigate.severity}</p>
            <p><b>Description:</b> {investigate.details}</p>
            <hr/>
            <p><b>Suggested Action:</b></p>
            {investigate.severity === "Critical" ? (
              <p>Immediately isolate host, rotate credentials, and perform forensic analysis.</p>
            ) : (
              <p>Review logs, confirm behavior, escalate if persistent.</p>
            )}
            <button className="btn" style={{ marginTop: 12 }} onClick={()=>setInvestigate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
