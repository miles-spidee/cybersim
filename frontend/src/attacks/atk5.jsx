import React, { useState, useRef, useEffect } from 'react'
import '../App.css'

// Traversal/lookup style CTF (client-only, safe)
const DEMO_FLAG_5 = 'flag{cybersim_traversal_demo}'

export default function Attack5({ onClose }) {
  const [started, setStarted] = useState(false)
  const [log, setLog] = useState([])
  const [cmd, setCmd] = useState('')
  const [found, setFound] = useState({ foundHint: false, foundFlag: false, submitted: false })
  const terminalRef = useRef(null)

  // small simulated structure with hidden area
  const sim = {
    '/': ['home', 'etc', 'public'],
    '/home': ['user'],
    '/home/user': ['notes.txt'],
    '/etc': ['config.cfg'],
    '/public': ['index.html', 'images'],
    '/public/images': ['logo.png'],
    '/var': ['tmp'],
    '/secret_area': ['hidden.txt'],
    '/secret_area/hidden.txt': DEMO_FLAG_5,
    '/notes.txt': 'Remember to check non-standard paths for hints.'
  }

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight }, [log])

  function startLab() {
    setStarted(true)
    setLog([`Traversal CTF started — ${new Date().toLocaleTimeString()}`, 'Hint: not everything is under / or /var. Try find and cat.'])
    setFound({ foundHint: false, foundFlag: false, submitted: false })
    setCmd('')
  }

  function append(line) { setLog(l => [...l, line]) }

  function run(e) {
    e?.preventDefault()
    if (!started) { append('Start the lab first (click Start Lab).'); return }
    const input = cmd.trim()
    if (!input) return
    append(`$ ${input}`)
    const parts = input.split(/\s+/)
    const c = parts[0]
    const arg = parts[1]

    if (c === 'help') {
      append('Commands: ls [path], cat <file>, find <name>, submit <flag>, help')
    } else if (c === 'ls') {
      const p = arg || '/'
      const node = sim[p]
      if (node && Array.isArray(node)) append(node.join('  '))
      else append(`ls: cannot access ${p}: No such file or directory`)
    } else if (c === 'cat') {
      if (!arg) append('cat: missing file operand')
      else {
        const key = arg.startsWith('/') ? arg : `/${arg}`
        const content = sim[key]
        if (content) {
          append(String(content))
          if (key === '/notes.txt') setFound(f => ({ ...f, foundHint: true }))
          if (key === '/secret_area/hidden.txt' || arg === 'hidden.txt') setFound(f => ({ ...f, foundFlag: true }))
        } else append(`cat: ${arg}: No such file or directory`)
      }
    } else if (c === 'find') {
      const name = arg
      if (!name) append('find: missing name')
      else {
        const results = Object.keys(sim).filter(k => k.endsWith(name) || (Array.isArray(sim[k]) && sim[k].includes(name)))
        append(results.length ? results.join('\n') : 'No results')
      }
    } else if (c === 'submit') {
      const flag = parts[1]
      if (!flag) append('submit: provide a flag')
      else if (flag === DEMO_FLAG_5) {
        append('Flag accepted — nice work!')
        setFound(f => ({ ...f, submitted: true }))
      } else append('Flag rejected — try again.')
    } else {
      append(`${c}: command not found`)
    }

    setCmd('')
  }

  return (
    <div style={{ padding: 16, maxWidth: 980, margin: '0 auto', color: 'var(--text)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>Traversal CTF — Find the Hidden File</h2>
          <div style={{ color: '#cbd5e1' }}>Explore the simulated filesystem with simple commands to locate and submit the flag.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => { if (onClose) onClose() }}>Exit</button>
          <button className="btn" onClick={() => { setLog([]); setFound({ foundHint: false, foundFlag: false, submitted: false }); setCmd('') }}>Reset</button>
          {!started ? <button className="btn primary" onClick={startLab}>Start Lab</button> : null}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginTop: 12 }}>
        <section style={{ textAlign: 'left' }}>
          <h3>Objective</h3>
          <p style={{ color: '#e6eef8' }}>Locate the hidden file using commands like <code>find</code> or <code>ls</code>, then read it with <code>cat</code> and submit the flag with <code>submit &lt;flag&gt;</code>.</p>

          <div style={{ marginTop: 12 }}>
            <h4>Terminal</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 8, borderRadius: 8, background: '#071018', color: '#d1d5db' }}>
              <div ref={terminalRef} style={{ maxHeight: 360, overflow: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13 }}>
                {log.length === 0 ? <div style={{ color: '#94a3b8' }}>Terminal is empty — start the lab and run commands.</div> : log.map((l,i)=>(<div key={i}>{l}</div>))}
              </div>
              <form onSubmit={run} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input value={cmd} onChange={(e)=>setCmd(e.target.value)} placeholder="type command (help)" className="atk-input" />
                <button className="btn" type="submit">Run</button>
              </form>
            </div>
          </div>
        </section>

        <aside style={{ textAlign: 'left' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 12, borderRadius: 8, background: 'var(--surface)' }}>
            <h4>Checkpoints</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><input type="checkbox" checked={found.foundHint} readOnly/> Read notes</li>
              <li><input type="checkbox" checked={found.foundFlag} readOnly/> Read hidden.txt</li>
              <li><input type="checkbox" checked={found.submitted} readOnly/> Flag submitted</li>
            </ul>

            <div style={{ marginTop: 12 }}>
              <h4>Hint</h4>
              <div style={{ color: '#cbd5e1' }}>Try <code>find hidden.txt</code> or <code>find secret</code>. Also check root-level non-standard paths.</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
