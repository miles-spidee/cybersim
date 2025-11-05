import React, { useState, useRef, useEffect } from 'react'
import '../App.css'

// Simple, safe client-side demo: reflected XSS-style echo vulnerability (simulated)
const DEMO_FLAG_3 = 'flag{cybersim_xss_demo}'

export default function Attack3({ onClose }) {
  const [started, setStarted] = useState(false)
  const [payload, setPayload] = useState('')
  const [log, setLog] = useState([])
  const [message, setMessage] = useState(null)
  const terminalRef = useRef(null)

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight }, [log])

  function startLab() {
    setStarted(true)
    setLog([`Lab started — ${new Date().toLocaleTimeString()}`])
    setMessage(null)
    setPayload('')
  }

  function appendLog(line) { setLog(l => [...l, line]) }

  function submitPayload(e) {
    e?.preventDefault()
    if (!started) { setMessage({ type: 'error', text: 'Start the lab first.' }); return }
    appendLog(`Input submitted: ${payload}`)

    // Simulated unsafe echo: if payload includes a script-like token, reveal demo flag
    const p = (payload || '').toLowerCase()
    if (p.includes('<script') || p.includes('alert(') || p.includes('onerror=')) {
      appendLog('Reflected content detected. Simulated browser executed injected script.')
      appendLog(`FLAG: ${DEMO_FLAG_3}`)
      setMessage({ type: 'success', text: 'Payload triggered the simulated reflection and revealed a flag (check terminal).' })
    } else {
      setMessage({ type: 'info', text: 'Payload echoed safely. Try a script-like payload (demo).' })
    }
  }

  const quicks = ["<script>alert(1)</script>", "'><script>alert(1)</script>", '" onerror=alert(1)']

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: 'var(--text)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>Reflected XSS — Safe Demo</h2>
          <div style={{ color: '#cbd5e1' }}>A simulated reflected XSS lab: we check for script-like input and demonstrate the concept safely on the client.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => { if (onClose) onClose() }}>Exit</button>
          <button className="btn" onClick={() => { setLog([]); setMessage(null); setPayload('') }}>Reset</button>
          {!started ? <button className="btn primary" onClick={startLab}>Start Lab</button> : null}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginTop: 12 }}>
        <section style={{ textAlign: 'left' }}>
          <h3>Overview</h3>
          <p style={{ color: '#e6eef8' }}>This small demo echoes user-provided text into a simulated page area. If the input resembles a script tag or event handler, we simulate an execution and reveal a demo flag — all safely within the client.</p>

          <div style={{ marginTop: 12 }}>
            <h4>Input box (simulated reflection)</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, background: 'var(--surface)' }}>
              <form onSubmit={submitPayload}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 13 }}>Payload</label>
                  <input value={payload} onChange={(e)=>setPayload(e.target.value)} placeholder="Enter text to reflect" className="atk-input" />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="btn primary" disabled={!started} type="submit">Submit</button>
                  <button type="button" className="btn ghost" onClick={()=>setPayload('')}>Clear</button>
                </div>
              </form>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>Quick payloads</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {quicks.map(q => <button key={q} className="btn" onClick={()=>setPayload(q)}>{q.length > 24 ? q.slice(0,20) + '…' : q}</button>)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Simulated Page (reflected output)</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: '#071018', color: '#d1d5db' }}>
              <div style={{ minHeight: 80, padding: 8 }}>
                {payload ? <div dangerouslySetInnerHTML={{ __html: payload }} /> : <div style={{ color: '#94a3b8' }}>Submitted payload will appear here (simulated reflection).</div>}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Terminal</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 8, borderRadius: 8, background: '#071018', color: '#d1d5db' }}>
              <div ref={terminalRef} style={{ maxHeight: 200, overflow: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13 }}>
                {log.length === 0 ? <div style={{ color: '#94a3b8' }}>Actions and responses will appear here.</div> : log.map((l,i)=>(<div key={i}>{l}</div>))}
              </div>
            </div>
          </div>
        </section>

        <aside style={{ textAlign: 'left' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: 'var(--surface)' }}>
            <h4>Hints</h4>
            <div style={{ color: '#cbd5e1', marginTop: 8 }}>Try submitting a script tag or an event handler to see the simulated effect. This is purely client-side and safe.</div>
            <div style={{ marginTop: 12 }}>
              <h4>Result</h4>
              {message ? <div style={{ color: message.type === 'success' ? '#86efac' : '#cbd5e1' }}>{message.text}</div> : <div style={{ color: '#cbd5e1' }}>No action yet.</div>}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
