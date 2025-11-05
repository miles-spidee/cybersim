import React, { useState, useRef, useEffect } from 'react'
import '../App.css'

// Simple, safe client-side demo: simulated file-read vuln
const DEMO_FLAG_2 = 'flag{cybersim_file_read_demo}'

export default function Attack2({ onClose }) {
  const [started, setStarted] = useState(false)
  const [filename, setFilename] = useState('')
  const [log, setLog] = useState([])
  const [message, setMessage] = useState(null)
  const terminalRef = useRef(null)

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight }, [log])

  function startLab() {
    setStarted(true)
    setLog([`Lab started — ${new Date().toLocaleTimeString()}`])
    setMessage(null)
    setFilename('')
  }

  function appendLog(line) { setLog(l => [...l, line]) }

  function fetchFile(e) {
    e?.preventDefault()
    if (!started) { setMessage({ type: 'error', text: 'Start the lab first.' }); return }
    appendLog(`Request: GET /download?file=${filename}`)
    const f = (filename || '').trim()
    // simulated safe logic: only reveal demo flag for secret.txt
    if (f === 'secret.txt' || f === '/var/www/secret.txt') {
      appendLog(`200 OK — file contents: \n${DEMO_FLAG_2}`)
      setMessage({ type: 'success', text: 'File retrieved (simulated). Check terminal for contents.' })
    } else if (!f) {
      setMessage({ type: 'error', text: 'Enter a filename to fetch (e.g. secret.txt).' })
    } else {
      appendLog('404 Not Found — file does not exist (simulated).')
      setMessage({ type: 'error', text: 'File not found. Try a known filename: secret.txt' })
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: '0 auto', color: 'var(--text)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>File Read — Simple Demo</h2>
          <div style={{ color: '#cbd5e1' }}>A tiny client-side simulation of a vulnerable file download endpoint.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => { if (onClose) onClose() }}>Exit</button>
          <button className="btn" onClick={() => { setLog([]); setMessage(null); setFilename('') }}>Reset</button>
          {!started ? <button className="btn primary" onClick={startLab}>Start Lab</button> : null}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginTop: 12 }}>
        <section style={{ textAlign: 'left' }}>
          <h3>Overview</h3>
          <p style={{ color: '#e6eef8' }}>This demo shows a naive file-download endpoint where the filename parameter is used directly. In this safe simulation, only a known filename will return the demo flag.</p>

          <div style={{ marginTop: 12 }}>
            <h4>Vulnerable endpoint (simulated)</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, background: 'var(--surface)' }}>
              <form onSubmit={fetchFile}>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 13 }}>Filename</label>
                  <input value={filename} onChange={(e)=>setFilename(e.target.value)} placeholder="e.g. secret.txt" className="atk-input" />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn primary" disabled={!started} type="submit">Fetch</button>
                  <button type="button" className="btn ghost" onClick={()=>setFilename('')}>Clear</button>
                </div>
              </form>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>Hints</div>
                <div style={{ marginTop: 8 }}>
                  Try known filename: <button className="btn" onClick={()=>setFilename('secret.txt')}>secret.txt</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Terminal</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 8, borderRadius: 8, background: '#071018', color: '#d1d5db' }}>
              <div ref={terminalRef} style={{ maxHeight: 220, overflow: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13 }}>
                {log.length === 0 ? <div style={{ color: '#94a3b8' }}>Actions and responses will appear here.</div> : log.map((l,i)=>(<div key={i}>{l}</div>))}
              </div>
            </div>
          </div>
        </section>

        <aside style={{ textAlign: 'left' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: 'var(--surface)' }}>
            <h4>Quick actions</h4>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn" onClick={()=>{ setFilename('secret.txt'); setMessage(null); appendLog('Prepared filename: secret.txt') }}>Use secret.txt</button>
            </div>

            <div style={{ marginTop: 12 }}>
              <h4>Result</h4>
              {message ? <div style={{ color: message.type === 'success' ? '#86efac' : '#ff6b6b' }}>{message.text}</div> : <div style={{ color: '#cbd5e1' }}>No action yet.</div>}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
