import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

/**
 * AttackLab — SQL Injection Demonstration
 * Connected to a local backend (lab_server.js)
 * Allows toggling between Insecure and Secure login endpoints
 * ✅ Shows popup when lab completed successfully
 */
export default function AttackLab({ onClose }) {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [insecureMode, setInsecureMode] = useState(true);
  const [log, setLog] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const LAB_BACKEND = "http://localhost:7070";
  const DEMO_FLAG = "flag{cybersim_lab_demo}";

  useEffect(() => {
    if (terminalRef.current)
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(id);
  }, [message]);

  // ✅ show popup when lab completed
  useEffect(() => {
    if (checkpoints.submitted) setShowSuccess(true);
  }, [checkpoints.submitted]);

  // ----------------------- Lab control -----------------------
  function startLab() {
    setStarted(true);
    setLog([`Lab started — ${new Date().toLocaleTimeString()}`]);
    setCheckpoints((c) => ({ ...c, openedLab: true }));
    setMessage({
      type: "info",
      text: "Lab started. Interact with the form or terminal.",
    });
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
    setShowSuccess(false);
  }

  function appendLog(line) {
    setLog((l) => [...l, line]);
  }

  // ----------------------- LOGIN handler -----------------------
  async function submitLogin(e) {
    e?.preventDefault();
    appendLog(`POST /login -> username=${username} password=${password}`);

    if (!started) {
      setMessage({ type: "error", text: "Start the lab first." });
      return;
    }

    const endpoint = insecureMode
      ? `${LAB_BACKEND}/api/lab/login`
      : `${LAB_BACKEND}/api/lab/login-secure`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        appendLog(`Login failed: ${data.message}`);
        setMessage({ type: "error", text: data.message });
        return;
      }

      appendLog(
        `Login successful on ${
          insecureMode ? "INSECURE" : "SECURE"
        } endpoint.`
      );
      appendLog(`User: ${data.user?.username || "unknown"}`);

      if (data.flag) {
        appendLog("FLAG: " + data.flag);
        setCheckpoints((c) => ({
          ...c,
          exploited: true,
          extractedFlag: true,
        }));
        setMessage({
          type: "success",
          text: "Flag revealed from backend!",
        });
      } else {
        setMessage({
          type: "info",
          text: "Login successful — no flag (non-admin).",
        });
      }

      // Save user in localStorage for Defense lab
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error(err);
      appendLog("Network error contacting backend.");
      setMessage({
        type: "error",
        text: "Network error connecting to lab backend.",
      });
    }
  }

  // ----------------------- Terminal simulation -----------------------
  function runTerminalCommand(cmd) {
    if (!cmd || !started) {
      setMessage({ type: "error", text: "Start the lab and enter a command." });
      return;
    }
    appendLog(`$ ${cmd}`);
    const lc = cmd.toLowerCase();

    if (lc.includes("curl") && lc.includes("flag")) {
      appendLog("curl http://localhost:7070/api/flag -> " + DEMO_FLAG);
      setCheckpoints((c) => ({ ...c, extractedFlag: true }));
      setMessage({ type: "success", text: "Flag fetched via simulated curl." });
    } else if (lc.includes("ls") || lc.includes("cat")) {
      appendLog("Simulated filesystem: /var/www/flag.txt (contains secret)");
    } else {
      appendLog(
        "Command executed (simulated). Try `curl http://localhost:7070/api/flag` or `cat /var/www/flag.txt`"
      );
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
        setMessage({
          type: "error",
          text: "Could not copy to clipboard. Copy manually.",
        });
      });
  }

  function submitFlag(e) {
    e?.preventDefault();
    if (flagInput.trim() === DEMO_FLAG) {
      setCheckpoints((c) => ({ ...c, submitted: true }));
      appendLog("Flag submitted: " + flagInput);
      setMessage({
        type: "success",
        text: "Correct — lab complete. Well done!",
      });
    } else {
      appendLog("Flag submission attempt: " + flagInput);
      setMessage({
        type: "error",
        text: "Incorrect flag — try again or extract it from the logs.",
      });
    }
  }

  const payloads = ["' OR '1'='1", "' OR '1'='1' -- ", "admin' -- "];

  // ----------------------- JSX -----------------------
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>SQL Injection — Student Lab</h2>
          <div style={styles.subtitle}>
            Toggle between real secure/insecure backends to observe injection.
          </div>
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
        {/* LEFT */}
        <section style={styles.leftColumn}>
          <div style={styles.card}>
            <h3>Overview</h3>
            <p style={styles.lead}>
              This lab connects to a small SQLite backend and demonstrates SQL
              Injection. Toggle between secure and insecure modes.
            </p>

            <div style={styles.toggleBox}>
              <label>
                <input
                  type="checkbox"
                  checked={insecureMode}
                  onChange={() => setInsecureMode((v) => !v)}
                />{" "}
                {insecureMode
                  ? "Insecure Mode (Vulnerable)"
                  : "Secure Mode (Safe)"}
              </label>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Vulnerable Login Page</h4>
              <div style={styles.vulnBox}>
                <form onSubmit={submitLogin}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={styles.fieldLabel}>Username</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="atk-input"
                      style={styles.input}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={styles.fieldLabel}>Password</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="password"
                      className="atk-input"
                      style={styles.input}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn primary"
                      disabled={!started}
                      type="submit"
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => {
                        setUsername("");
                        setPassword("");
                      }}
                    >
                      Clear
                    </button>
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {payloads.map((p) => (
                        <button
                          key={p}
                          className="btn"
                          onClick={() => copyPayload(p)}
                          disabled={!started}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <h4 style={styles.subhead}>Simulated Terminal</h4>
              <div style={styles.terminalOuter}>
                <div ref={terminalRef} style={styles.terminalWindow}>
                  {log.length === 0 ? (
                    <div style={styles.terminalEmpty}>
                      Terminal output will appear here.
                    </div>
                  ) : (
                    log.map((l, i) => (
                      <div key={i} style={styles.terminalLine}>
                        <span style={styles.terminalPrompt}>$</span> {l}
                      </div>
                    ))
                  )}
                </div>
                <TerminalInput
                  onRun={(cmd) => runTerminalCommand(cmd)}
                  started={started}
                />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h4>Progress</h4>
            <div style={{ marginTop: 8 }}>
              <ProgressRow label="Open lab" done={checkpoints.openedLab} />
              <ProgressRow label="Copied payload" done={checkpoints.copiedPayload} />
              <ProgressRow label="Exploited form" done={checkpoints.exploited} />
              <ProgressRow label="Extracted flag" done={checkpoints.extractedFlag} />
              <ProgressRow label="Submitted flag" done={checkpoints.submitted} />
            </div>

            <div style={{ marginTop: 18 }}>
              <h4>Submit flag</h4>
              <form
                onSubmit={submitFlag}
                style={{ display: "flex", gap: 8, marginTop: 8 }}
              >
                <input
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="flag{...}"
                  className="atk-input"
                  style={{ ...styles.input, margin: 0 }}
                />
                <button className="btn primary" type="submit" disabled={!started}>
                  Submit
                </button>
              </form>

              {message ? (
                <div
                  style={{
                    marginTop: 12,
                    color:
                      message.type === "success"
                        ? "#86efac"
                        : message.type === "error"
                        ? "#ff6b6b"
                        : "#cbd5e1",
                  }}
                >
                  {message.text}
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </main>

      {/* ✅ Success popup modal */}
      {showSuccess && (
        <div style={popup.overlay}>
          <div style={popup.box}>
            <h2>🎉 Lab Completed!</h2>
            <p>You’ve successfully finished the SQL Injection lab.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "center" }}>
              <button className="btn primary" onClick={() => navigate("/")}>
                Return Home
              </button>
              <button className="btn ghost" onClick={() => setShowSuccess(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- helper components ---------- */
function TerminalInput({ onRun, started }) {
  const [cmd, setCmd] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        value={cmd}
        onChange={(e) => setCmd(e.target.value)}
        placeholder={
          started
            ? "run command (simulated) e.g. curl http://localhost:7070/api/flag"
            : "Start the lab to run commands"
        }
        style={{
          flex: 1,
          padding: 10,
          background: "#0b1220",
          color: "#fff",
          border: "1px solid #23303a",
          borderRadius: 8,
          outline: "none",
        }}
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
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          background: done
            ? "linear-gradient(90deg,#34d399,#10b981)"
            : "rgba(255,255,255,0.06)",
          boxShadow: done ? "0 0 8px rgba(34,197,94,0.25)" : "none",
        }}
      />
      <div style={{ color: done ? "#e6ffed" : "#cbd5e1" }}>{label}</div>
    </div>
  );
}

/* ---------- styles ---------- */
const styles = {
  container: { padding: 20, maxWidth: 1200, margin: "0 auto", color: "#fff" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 },
  title: { margin: "0 0 6px 0", fontSize: 22 },
  subtitle: { color: "#9aa6b2", fontSize: 13 },
  toolbar: { display: "flex", gap: 8 },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginTop: 10 },
  leftColumn: { textAlign: "left" },
  sidebar: { textAlign: "left" },
  card: { background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", padding: 18, borderRadius: 12 },
  lead: { color: "#dbeafe", marginTop: 8, lineHeight: 1.5 },
  subhead: { fontSize: 14, color: "#cbd5e1", marginBottom: 8 },
  vulnBox: { border: "1px solid rgba(255,255,255,0.06)", padding: 14, borderRadius: 8, background: "#071018" },
  fieldLabel: { fontSize: 13, color: "#9aa6b2", marginBottom: 6 },
  input: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "#071018", color: "#fff" },
  terminalOuter: { marginTop: 8, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.04)" },
  terminalWindow: { maxHeight: 180, overflow: "auto", padding: 12, fontFamily: "monospace", background: "#071018", color: "#d1d5db" },
  terminalEmpty: { color: "#94a3b8" },
  terminalLine: { marginBottom: 6 },
  terminalPrompt: { color: "#6ee7b7", marginRight: 8, fontWeight: 700 },
  sideCard: { background: "#0b1220", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)" },
  toggleBox: { background: "#0b1220", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", marginTop: 12 },
};

/* ---------- popup styles ---------- */
const popup = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  box: {
    width: "420px",
    background: "#0b1220",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "25px",
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    animation: "fadeIn 0.4s ease",
  },
};

/* Add a quick fade-in animation for popup (optional) */
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    console.warn("Couldn't insert popup animation rule:", e);
  }
}
