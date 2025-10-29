import React, { useState } from 'react'
import './App.css'
import SingleAttackSession from './attacks/atk1'

function App() {
  const [page, setPage] = useState('home')

  function gotoLearn(e) {
    e && e.preventDefault()
    setPage('learn')
  }

  return (
    <div id="root">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-text">Cybersim</span>
        </div>
        <div className="nav-actions">
          <a className="nav-link" href="#home" onClick={(e)=>{e.preventDefault(); setPage('home')}}>Home</a>
          <a className="nav-link" href="#get-started" onClick={(e)=>{e.preventDefault(); setPage('get-started')}}>Get started</a>
          <a className="nav-link" href="#articles" onClick={(e)=>{e.preventDefault(); setPage('articles')}}>Articles</a>
          <a className="nav-link" href="#learn" onClick={gotoLearn}>Learn</a>
          <a className="nav-link login" href="#login" onClick={(e)=>{e.preventDefault(); setPage('login')}}>Log in</a>
        </div>
      </nav>

      {page === 'learn' ? (
        <main style={{ paddingTop: '1.25rem' }}>
          <SingleAttackSession onClose={() => setPage('home')} />
        </main>
      ) : (
        <main className="main-placeholder">
          <div className="card center-card">
            <h1>Welcome to Cybersim</h1>
            <p className="lead">A learning platform for cybersecurity — rebuilding the UI from scratch.</p>
            <div className="actions">
              <button className="btn primary" onClick={(e)=>{e.preventDefault(); setPage('get-started')}}>Get started</button>
              <button className="btn ghost" onClick={gotoLearn}>Learn more</button>
            </div>
          </div>

          <section className="unique-features">
            <h2>Platform highlights</h2>
            <ul>
              <li>Interactive sandboxed labs</li>
              <li>Beginner → advanced CTF tracks</li>
              <li>Linux command games and exercises</li>
              <li>Step-by-step writeups and community guides</li>
            </ul>
          </section>
        </main>
      )}

      <footer className="site-footer">
        <p className="muted">Built for learning — use responsibly. © Cybersim</p>
      </footer>
    </div>
  )
}

export default App
