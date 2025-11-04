import React, { useState, useEffect, useRef } from "react";
import "../App.css";

// Safe client-side demo flag
const DEMO_FLAG = "flag{cybersim_lab_demo}";

/**
 * AttackLab - SQL Injection student lab
 * - No hints shown (removed per request)
 * - Polished, professional UI with improved terminal and controls
 */
export default function AttackLab({ onClose }) {
  const [started, setStarted] = useState(false);
  const [log, setLog] = useState([]);
  const [checkpoints, setCheckpoints] = useState({
    openedLab: false,
    copiedPayload: false,
    exploited: false,
    extractedFlag: false,
    submitted: false,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [flagInput, setFlagInput] = useState("");
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current)
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    // reset message after 4s
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(id);
  }, [message]);

  function startLab() {
    setStarted(true);
    setLog([`Lab started — ${new Date().toLocaleTimeString()}`]);
    setCheckpoints((c) => ({ ...c, openedLab: true }));
    setMessage({ type: "info", text: "Lab started. Interact with the form or terminal." });
    setFlagInput("");
    setUsername("");
    setPassword("");
  }

  function resetLab() {
    setStarted(false);
    setLog([]);
    setCheckpoints({
      openedLab: false,
      copiedPayload: false,
      exploited: false,
      extractedFlag: false,
      submitted: false,
    });
    setMessage({ type: "info", text: "Lab reset." });
    setFlagInput("");
    setUsername("");
    setPassword("");
  }

  function appendLog(line) {
    setLog((l) => [...l, line]);
  }

  // Simulated vulnerable login handler (client-side only)
  function submitLogin(e) {
    e?.preventDefault();
    appendLog(`POST /login -> username=${username} password=${password}`);

    const u = (username || "").toLowerCase();
    if (u.includes("' or ") || u.includes(" or ") || u.includes("1=1") || u.includes("'='1")) {
      appendLog("Login bypass successful — authenticated as admin");
      appendLog("Reading secret file: /var/www/flag.txt");
      appendLog(`FLAG: ${DEMO_FLAG}`);
      setCheckpoints((c) => ({ ...c, exploited: true, extractedFlag: true }));
      setMessage({ type: "success", text: "Exploit worked — flag revealed in logs." });
    } else {
      setMessage({ type: "error", text: "Login failed. Try a special payload in the username." });
    }
  }

  function copyPayload(p) {
    navigator.clipboard
      ?.writeText(p)
      .then(() => {
        appendLog(`Copied payload: ${p}`);
        setCheckpoints((c) => ({ ...c, copiedPayload: true }));
        setMessage({ type: "success", text: "Payload copied to clipboard." });
      })
      .catch(() => {
        setMessage({ type: "error", text: "Could not copy to clipboard. Copy manually." });
      });
  }

  function runTerminalCommand(cmd) {
    if (!cmd || !started) {
      setMessage({ type: "error", text: "Start the lab and enter a command." });
      return;
    }
    appendLog(`$ ${cmd}`);
    const lc = (cmd || "").toLowerCase();
    if (lc.includes("curl") && lc.includes("flag")) {
      appendLog("curl http://localhost:3001/flag -> " + DEMO_FLAG);
      setCheckpoints((c) => ({ ...c, extractedFlag: true }));
      setMessage({ type: "success", text: "Flag fetched via simulated curl." });
    } else if (lc.includes("ls") || lc.includes("cat")) {
      appendLog("Simulated filesystem: /var/www/flag.txt (contains secret)");
    } else {
      appendLog("Command executed (simulated). Try `curl http://localhost:3001/flag` or `cat /var/www/flag.txt`");
    }
  }

  function submitFlag(e) {
    e?.preventDefault();
    if (flagInput.trim() === DEMO_FLAG) {
      setCheckpoints((c) => ({ ...c, submitted: true }));
      appendLog("Flag submitted: " + flagInput);
      setMessage({ type: "success", text: "Correct — lab complete. Well done!" });
    } else {
      appendLog("Flag submission attempt: " + flagInput);
      setMessage({ type: "error", text: "Incorrect flag — try again or extract it from the logs." });
    }
  }

  const payloads = ["' OR '1'='1", "' OR '1'='1' -- ", "admin' -- "];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>SQL Injection — Student Lab</h2>
          <div style={styles.subtitle}>A safe, client-side simulation that demonstrates a basic SQL injection workflow.</div>
        </div>

        <div style={styles.toolbar}>
          <button className="btn ghost" onClick={() => onClose && onClose()}>
            Exit
          </button>
          <button className="btn" onClick={resetLab}>
            Reset
          </button>
          {!started ? (
            <button className="btn primary" onClick={startLab}>
              Start Lab
            </button>
          ) : null}
        </div>
      </header>

      <main style={styles.mainGrid}>
        {/* LEFT: primary content */}
        <section style={styles.leftColumn}>
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h3 style={{ margin: 0 }}>Overview</h3>
            </div>
            <p style={styles.lead}>
              This lab guides you through a minimal SQL injection scenario: a naive login form vulnerable to a boolean-based injection. Your goal is to bypass the login and extract the secret flag.
            </p>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Simulated vulnerable page</h4>
              <div style={styles.vulnBox}>
                <form onSubmit={submitLogin}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={styles.fieldLabel}>Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="atk-input" style={styles.input} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={styles.fieldLabel}>Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="atk-input" style={styles.input} />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn primary" disabled={!started} type="submit">
                      Login
                    </button>
                    <button type="button" className="btn ghost" onClick={() => { setUsername(""); setPassword(""); }}>
                      Clear
                    </button>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      {payloads.map((p) => (
                        <button key={p} className="btn" onClick={() => copyPayload(p)} disabled={!started}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Simulated terminal</h4>
              <div style={styles.terminalOuter}>
                <div ref={terminalRef} style={styles.terminalWindow}>
                  {log.length === 0 ? <div style={styles.terminalEmpty}>Terminal output will appear here.</div> : log.map((l, i) => (<div key={i} style={styles.terminalLine}><span style={styles.terminalPrompt}>$</span> {l}</div>))}
                </div>
                <TerminalInput onRun={(cmd) => runTerminalCommand(cmd)} started={started} />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h4 style={{ marginTop: 0 }}>Progress</h4>
            <div style={{ marginTop: 8 }}>
              <ProgressRow label="Open lab" done={checkpoints.openedLab} />
              <ProgressRow label="Copied payload" done={checkpoints.copiedPayload} />
              <ProgressRow label="Exploited form" done={checkpoints.exploited} />
              <ProgressRow label="Extracted flag" done={checkpoints.extractedFlag} />
              <ProgressRow label="Submitted flag" done={checkpoints.submitted} />
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Submit flag</h4>
              <form onSubmit={submitFlag} style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input value={flagInput} onChange={(e) => setFlagInput(e.target.value)} placeholder="flag{...}" className="atk-input" style={{ ...styles.input, margin: 0 }} />
                <button className="btn primary" type="submit" disabled={!started}>Submit</button>
              </form>

              {message ? (
                <div style={{ marginTop: 12, color: message.type === "success" ? "#86efac" : message.type === "error" ? "#ff6b6b" : "#cbd5e1" }}>
                  {message.text}
                </div>
              ) : null}
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Tools / Quick command</h4>
              <pre style={styles.snippet}>curl http://localhost:3001/flag</pre>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

/* ---------- small helper components ---------- */

function TerminalInput({ onRun, started }) {
  const [cmd, setCmd] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        placeholder={started ? "run command (simulated) e.g. curl http://localhost:3001/flag" : "Start the lab to run commands"}
        style={{ flex: 1, padding: 10, background: "#0b1220", color: "#fff", border: "1px solid #23303a", borderRadius: 8, outline: "none" }}
      />
      <button
        className="btn"
        onClick={() => {
          if (!cmd) return;
          onRun(cmd);
          setCmd("");
        }}
        disabled={!started}
      >
        Run
      </button>
    </div>
  );
}

function ProgressRow({ label, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{
        width: 12,
        height: 12,
        borderRadius: 3,
        background: done ? "linear-gradient(90deg,#34d399,#10b981)" : "rgba(255,255,255,0.06)",
        boxShadow: done ? "0 0 8px rgba(34,197,94,0.25)" : "none",
      }} />
      <div style={{ color: done ? "#e6ffed" : "#cbd5e1" }}>{label}</div>
    </div>
  );
}

/* ---------- styles ---------- */

const styles = {
  container: {
    padding: 20,
    maxWidth: 1200,
    margin: "0 auto",
    color: "#fff",
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 12,
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: 22,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "#9aa6b2",
    fontSize: 13,
  },
  toolbar: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 20,
    marginTop: 10,
  },
  leftColumn: {
    textAlign: "left",
  },
  sidebar: {
    textAlign: "left",
  },
  card: {
    background: "linear-gradient(180deg, rgba(11,18,32,0.85), rgba(6,10,20,0.85))",
    border: "1px solid rgba(255,255,255,0.04)",
    padding: 18,
    borderRadius: 12,
  },
  lead: {
    color: "#dbeafe",
    marginTop: 8,
    lineHeight: 1.5,
  },
  subhead: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 8,
  },
  vulnBox: {
    border: "1px solid rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 8,
    background: "var(--surface)",
    color: "var(--text)",
  },
  fieldLabel: {
    fontSize: 13,
    color: "#9aa6b2",
    display: "block",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "#071018",
    color: "#fff",
    outline: "none",
  },
  terminalOuter: {
    marginTop: 8,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  terminalWindow: {
    maxHeight: 180,
    overflow: "auto",
    padding: 12,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
    fontSize: 13,
    background: "#071018",
    color: "#d1d5db",
    borderRadius: 6,
  },
  terminalEmpty: {
    color: "#94a3b8",
  },
  terminalLine: {
    marginBottom: 6,
  },
  terminalPrompt: {
    color: "#6ee7b7",
    marginRight: 8,
    fontWeight: 700,
  },
  snippet: {
    background: "#0b1220",
    color: "#d1d5db",
    padding: 10,
    borderRadius: 8,
    fontSize: 12,
  },
};
