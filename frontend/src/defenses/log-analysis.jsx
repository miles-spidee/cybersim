import React, { useState, useMemo } from "react";
import "../App.css";

export default function LogAnalysis() {
  const [query, setQuery] = useState("");

  const rawLogs = [
    "Nov 04 10:01:12 sshd[1234]: Failed password for invalid user admin from 10.0.0.5 port 40222",
    "Nov 04 10:03:44 systemd[1]: Started nginx service",
    "Nov 04 10:05:02 postgres[200]: ERROR Database connection failed at auth handshake",
    "Nov 04 10:07:11 app[200]: INFO User login: alice (10.0.0.11)",
    "Nov 04 10:09:33 sshd[1236]: Accepted password for user bob from 185.244.12.91 port 50222",
    "Nov 04 10:15:22 webapp[451]: WARNING Slow response detected for /login route",
    "Nov 04 10:18:07 firewall: BLOCK outbound connection attempt to 45.12.221.8 on port 4444"
  ];

  // Parse logs into structured objects
  const parsedLogs = rawLogs.map(line => {
    const ipMatch = line.match(/\b\d{1,3}(\.\d{1,3}){3}\b/);
    const ip = ipMatch ? ipMatch[0] : null;

    let severity = "Info";
    if (line.includes("Failed password") || line.includes("BLOCK")) severity = "High";
    if (line.includes("ERROR")) severity = "Critical";
    if (line.includes("WARNING")) severity = "Medium";
    if (line.includes("Accepted password") || line.includes("Started") || line.includes("INFO")) severity = "Info";

    return {
      timestamp: line.substring(0, 15),
      process: line.match(/(\w+)(\[\d+\])?/)[0],
      message: line.substring(line.indexOf(":") + 2),
      ip,
      severity,
      raw: line
    };
  });

  // Filter by query
  const results = useMemo(() => {
    if (!query) return parsedLogs;
    return parsedLogs.filter(l => l.raw.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  function highlight(text, q) {
    if (!q) return text;
    const regex = new RegExp(`(${q})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <span key={i} style={{ background:"#ffca28", color:"#000" }}>{part}</span>
        : part
    );
  }

  function severityColor(s) {
    return ({
      Critical: "#ff4d4f",
      High: "#ff7a45",
      Medium: "#faad14",
      Info: "#4ade80"
    }[s] || "#94a3b8");
  }

  // Summary statistics
  const summary = {
    total: parsedLogs.length,
    critical: parsedLogs.filter(l => l.severity === "Critical").length,
    high: parsedLogs.filter(l => l.severity === "High").length,
    medium: parsedLogs.filter(l => l.severity === "Medium").length,
    info: parsedLogs.filter(l => l.severity === "Info").length
  };

  return (
    <div className="defense-container session-layout session-column">

      <aside className="session-title">
        <h1>Log Analysis Console</h1>
        <p>Real-time log inspection with severity tagging and anomaly detection.</p>
      </aside>

      <main className="session-main">

        {/* Summary Bar */}
        <div className="panel" style={{ marginBottom: 10 }}>
          <h4>System Event Summary</h4>
          <div style={{ display:"flex", gap:20, marginTop:6 }}>
            <span>Total: {summary.total}</span>
            <span style={{ color: severityColor("Critical") }}>Critical: {summary.critical}</span>
            <span style={{ color: severityColor("High") }}>High: {summary.high}</span>
            <span style={{ color: severityColor("Medium") }}>Medium: {summary.medium}</span>
            <span style={{ color: severityColor("Info") }}>Info: {summary.info}</span>
          </div>
        </div>

        <div className="panel">
          {/* Search Bar */}
          <form onSubmit={(e)=>e.preventDefault()} style={{ display:"flex", gap:8 }}>
            <input
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              className="atk-input"
              placeholder="Search logs: sshd, ERROR, IP, username, etc..."
            />
            <button className="btn" onClick={()=>setQuery("")}>Clear</button>
          </form>

          {/* Results */}
          <div style={{ marginTop: 14 }}>
            {results.length === 0 ? (
              <div style={{ color:"#94a3b8" }}>No matching logs.</div>
            ) : (
              results.map((log, i) => (
                <div key={i} style={{
                  background:"#071018",
                  padding:10,
                  borderRadius:6,
                  marginBottom:8,
                  borderLeft:`4px solid ${severityColor(log.severity)}`,
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <strong style={{ color: severityColor(log.severity) }}>
                      {log.severity}
                    </strong>
                    <small style={{ color:"#94a3b8" }}>{log.timestamp}</small>
                  </div>

                  <div style={{ color:"#cbd5e1" }}>
                    <b>{log.process}</b>: {highlight(log.message, query)}
                  </div>

                  {log.ip && (
                    <div style={{ marginTop:4, fontSize:"0.85em", color:"#7dd3fc" }}>
                      Source IP: {log.ip}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
