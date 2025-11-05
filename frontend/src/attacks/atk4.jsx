import React, { useState, useRef, useEffect } from 'react'
import '../App.css'

// CTF-style simulated Linux terminal (client-side safe)
const DEMO_CTF_FLAG = 'flag{cybersim_ctf_cli_demo}'

export default function Attack4({ onClose }) {
  const [started, setStarted] = useState(false)
  const [log, setLog] = useState([])
  const [cmd, setCmd] = useState('')
  const [checkpoints, setCheckpoints] = useState({ foundReadme: false, foundFlag: false, submitted: false })
  const terminalRef = useRef(null)

  // simulated filesystem
  const fs = {
    '/': ['home', 'var', 'README.md'],
    '/home': ['player'],
    '/home/player': ['notes.txt'],
    '/var': ['www'],
    '/var/www': ['index.html', 'secret.txt'],
    '/var/www/secret.txt': DEMO_CTF_FLAG,
    '/README.md': 'Welcome to the mini CTF. Use linux commands like ls, cat, grep to explore. Good luck!'
  }

  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight }, [log])

  function startLab() {
    setStarted(true)
    setLog([`CTF started — ${new Date().toLocaleTimeString()}`, 'Type `help` for a short command list.'])
    setCheckpoints({ foundReadme: false, foundFlag: false, submitted: false })
    setCmd('')
  }

  function append(line) { setLog(l => [...l, line]) }

  function runCommand(e) {
    e?.preventDefault()
    if (!started) { append('Start the lab first (click Start Lab).'); return }
    const input = cmd.trim()
    if (!input) return
    append(`$ ${input}`)
    const parts = input.split(/\s+/)
    const c = parts[0]
    const arg = parts[1]

    if (c === 'help') {
      append('Available: ls [path], cat <file>, pwd, cd <path>, grep <pat> <file>, find <name>, submit <flag>')
    } else if (c === 'ls') {
      const path = arg || '/'
      const node = fs[path]
      if (node && Array.isArray(node)) append(node.join('  '))
      else append('ls: cannot access ' + path + ': No such file or directory')
    } else if (c === 'cat') {
      if (!arg) { append('cat: missing file operand'); }
      else {
        const key = arg.startsWith('/') ? arg : (arg.includes('/') ? arg : `/var/www/${arg}`)
        const content = fs[key] || fs[`/${arg}`]
        if (content) {
          append(String(content))
          if (key === '/README.md' || arg === 'README.md') setCheckpoints(c => ({ ...c, foundReadme: true }))
          if (key === '/var/www/secret.txt' || arg === 'secret.txt') setCheckpoints(c => ({ ...c, foundFlag: true }))
        } else {
          append(`cat: ${arg}: No such file or directory`)
        }
      }
    } else if (c === 'pwd') {
      append('/')
    } else if (c === 'cd') {
      append('cd simulated (no persistent cwd in this demo). Use absolute paths like /var/www')
    } else if (c === 'grep') {
      if (parts.length < 3) append('grep: usage: grep <pattern> <file>')
      else {
        const pat = parts[1]
        const file = parts[2]
        const key = file.startsWith('/') ? file : `/${file}`
        const content = fs[key] || fs[`/var/www/${file}`]
        if (content) {
          const out = String(content).split('\n').filter(l => l.includes(pat))
          append(out.length ? out.join('\n') : '')
        } else append('grep: ' + file + ': No such file or directory')
      }
    } else if (c === 'find') {
      const name = arg
      if (!name) append('find: missing filename')
      else {
        const results = Object.keys(fs).filter(k => k.endsWith(name) || (Array.isArray(fs[k]) && fs[k].includes(name)))
        append(results.length ? results.join('\n') : 'No results')
      }
    } else if (c === 'submit') {
      const flag = parts[1]
      if (!flag) append('submit: provide a flag')
      else if (flag === DEMO_CTF_FLAG) {
        append('Flag accepted — well done!')
        setCheckpoints(c => ({ ...c, submitted: true }))
      } else append('Flag rejected — try again.')
    } else {
      append(`${c}: command not found`)
    }

    setCmd('')
  }

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto', color: 'var(--text)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>Mini CTF — Command Line Practice</h2>
          <div style={{ color: '#cbd5e1' }}>Use simulated linux commands to explore a small filesystem and retrieve the flag.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" onClick={() => { if (onClose) onClose() }}>Exit</button>
          <button className="btn" onClick={() => { setLog([]); setCheckpoints({ foundReadme: false, foundFlag: false, submitted: false }); setCmd('') }}>Reset</button>
          {!started ? <button className="btn primary" onClick={startLab}>Start Lab</button> : null}
        </div>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginTop: 12 }}>
        <section style={{ textAlign: 'left' }}>
          <h3>Task</h3>
          <p style={{ color: '#e6eef8' }}>Locate the flag in the simulated filesystem and submit it using <code>submit &lt;flag&gt;</code>.</p>

          <div style={{ marginTop: 12 }}>
            <h4>Simulated Terminal</h4>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', padding: 8, borderRadius: 8, background: '#071018', color: '#d1d5db' }}>
              <div ref={terminalRef} style={{ maxHeight: 360, overflow: 'auto', padding: 8, fontFamily: 'monospace', fontSize: 13 }}>
                {log.length === 0 ? <div style={{ color: '#94a3b8' }}>Terminal is empty — run some commands when the lab is started.</div> : log.map((l,i)=>(<div key={i}>{l}</div>))}
              </div>
              <form onSubmit={runCommand} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
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
              <li><input type="checkbox" checked={checkpoints.foundReadme} readOnly /> Read README.md</li>
              <li><input type="checkbox" checked={checkpoints.foundFlag} readOnly /> Read secret.txt</li>
              <li><input type="checkbox" checked={checkpoints.submitted} readOnly /> Submitted flag</li>
            </ul>

            <div style={{ marginTop: 12 }}>
              <h4>Hints</h4>
              <div style={{ color: '#cbd5e1' }}>Try: <code>ls /var/www</code>, <code>cat /README.md</code>, <code>cat /var/www/secret.txt</code>, then <code>submit &lt;flag&gt;</code>.</div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
