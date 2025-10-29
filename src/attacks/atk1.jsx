// SingleAttackSession.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const LAB_URL = 'http://localhost:3001/';
const SUBMIT_FLAG_URL = 'http://localhost:4000/submit-flag';
const SESSION_TTL_SEC = 5 * 60; // 5 minutes session

export default function SingleAttackSession({ onClose }) {
  const [sessionActive, setSessionActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_TTL_SEC);
  const [flag, setFlag] = useState('');
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [log, setLog] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!sessionActive) return;
    setLog(l => [...l, `Session started (${new Date().toLocaleTimeString()})`]);
    setSecondsLeft(SESSION_TTL_SEC);

    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          setSessionActive(false);
          setLog(l => [...l, `Session expired (${new Date().toLocaleTimeString()})`]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sessionActive]);

  function startSession() {
    setMsg(null);
    setFlag('');
    setSessionActive(true);
    // if you later implement start-lab backend, call it here
  }

  function endSession() {
    clearInterval(timerRef.current);
    setSessionActive(false);
    setLog(l => [...l, `Session stopped by user (${new Date().toLocaleTimeString()})`]);
    if (onClose) onClose();
  }

  function copyPayload(payload, description = '') {
    navigator.clipboard?.writeText(payload).then(() => {
      setLog(l => [...l, `Copied payload: ${payload} ${description ? `(${description})` : ''}`]);
      setMsg(`Payload copied to clipboard — paste in the lab form.`);
    }).catch(() => {
      setMsg('Could not copy payload. Manually select & copy.');
    });
  }

  async function submitFlag(e) {
    e?.preventDefault();
    setMsg(null);
    setSubmitting(true);
    try {
      const res = await axios.post(SUBMIT_FLAG_URL, { flag });
      setMsg(res.data?.message || 'Submitted — check response.');
      setLog(l => [...l, `Flag submission: ${flag} -> ${res.data?.ok ? 'OK' : 'INCORRECT'}`]);
    } catch (err) {
      setMsg('Error submitting flag: ' + (err?.response?.data?.message || err.message));
      setLog(l => [...l, `Submit error: ${err?.message || 'unknown'}`]);
    } finally {
      setSubmitting(false);
    }
  }

  function openLabNewTab() {
    window.open(LAB_URL, '_blank', 'noopener,noreferrer');
    setLog(l => [...l, `Opened lab in new tab`]);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{
      fontFamily: 'system-ui, Arial',
      padding: 16,
      maxWidth: 1000,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin: 0 }}>SQLi — Single Attack Session (Demo)</h2>
        <div>
          <button onClick={endSession} style={{ marginRight: 8 }}>End</button>
          <button onClick={startSession} disabled={sessionActive}>Start Session</button>
        </div>
      </header>

      <section style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12 }}>
        <div>
          <div style={{ marginBottom: 8 }}>
            <strong>Session status:</strong>
            <span style={{ marginLeft: 8 }}>
              {sessionActive ? (
                <span style={{ color: 'green' }}>Active — {minutes}:{String(seconds).padStart(2,'0')}</span>
              ) : (
                <span style={{ color: '#666' }}>Not active</span>
              )}
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <button onClick={openLabNewTab} style={{ marginRight: 8 }}>Open Lab (new tab)</button>
            <button onClick={() => window.location.reload()}>Reload Lab</button>
          </div>

          <div style={{ border: '1px solid #eee', height: 360, marginBottom: 12 }}>
            {sessionActive ? (
              <iframe
                src={LAB_URL}
                title="SQLi Lab"
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <div style={{ padding: 20, color: '#777' }}>
                Session inactive. Click <strong>Start Session</strong> to enable the lab iframe.
                <div style={{ marginTop: 8 }}>
                  For the demo, ensure your vulnerable app is running on <code>http://localhost:3001</code>.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Quick payloads / hints</strong>
            <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
              <button onClick={() => copyPayload(`' OR '1'='1`, 'bypass auth')}>`' OR '1'='1`</button>
              <button onClick={() => copyPayload(`' OR '1'='1' -- `, 'comment rest')}>`' OR '1'='1' -- `</button>
              <button onClick={() => copyPayload(`' UNION SELECT username, secret FROM users -- `, 'union hint')}>UNION hint</button>
              <button onClick={() => copyPayload(`' OR 'a'='a`, 'simple true')}>`' OR 'a'='a`</button>
            </div>
            <p style={{ color: '#555', marginTop: 8 }}>
              Click a payload to copy it to clipboard; then paste into the lab form (username or password) inside the iframe.
            </p>
          </div>

          <form onSubmit={submitFlag} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="paste found flag here (e.g. flag{...})"
              style={{ flex: 1, padding: '8px 10px' }}
            />
            <button type="submit" disabled={submitting || !sessionActive}>
              {submitting ? 'Submitting...' : 'Submit Flag'}
            </button>
            <button type="button" onClick={() => { setFlag(''); setMsg(null); }}>Clear</button>
          </form>

          {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
        </div>

        <aside style={{ borderLeft: '1px solid #f1f1f1', paddingLeft: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <strong>Session log</strong>
            <div style={{ marginTop: 8, maxHeight: 220, overflow: 'auto', padding: 8, background: '#fafafa', borderRadius: 6 }}>
              {log.length === 0 ? <div style={{ color: '#999' }}>No actions yet.</div> :
                log.slice().reverse().map((l, i) => <div key={i} style={{ fontSize: 13 }}>{l}</div>)
              }
            </div>
          </div>

          <div>
            <strong>Demo checklist</strong>
            <ul style={{ paddingLeft: 18 }}>
              <li>Ensure vulnerable app running at <code>http://localhost:3001</code></li>
              <li>Start session (5 min TTL)</li>
              <li>Open lab iframe / new tab and paste payload into username/password</li>
              <li>Extract the flag from results and submit it</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
