import React from 'react'

export default function Landing({ onExplore }) {
  return (
    <div className="page landing">
      <header className="site-hero">
        <div className="hero-inner">
          <h1 className="hero-title">Cybersim — Learn & Practice Cybersecurity</h1>
          <p className="hero-sub">Interactive articles, CTFs, simulated attacks, and Linux command challenges — all in your browser.</p>
          <div className="hero-ctas">
            <button className="btn primary" onClick={onExplore}>Explore what we provide</button>
            <a className="btn ghost" href="#features">See features</a>
          </div>
        </div>
      </header>

      <section id="features" className="section features">
        <h2>What we provide</h2>
        <p className="muted">Hands-on learning split into approachable modules.</p>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-emoji">📚</div>
            <h3>Articles</h3>
            <p>Concise, practical writeups on web security, forensics, networking and more.</p>
          </article>

          <article className="feature-card">
            <div className="feature-emoji">🛠️</div>
            <h3>Labs & Simulations</h3>
            <p>Interactive environments where you can run safe attacks and learn defensive techniques.</p>
          </article>

          <article className="feature-card">
            <div className="feature-emoji">🏆</div>
            <h3>CTFs</h3>
            <p>Challenge-based exercises that level up your skills — from web to crypto to forensics.</p>
          </article>

          <article className="feature-card">
            <div className="feature-emoji">🐧</div>
            <h3>Linux Command Games</h3>
            <p>Playful terminal puzzles to sharpen command-line fluency and scripting.</p>
          </article>

          <article className="feature-card">
            <div className="feature-emoji">🧪</div>
            <h3>Simulated Attacks</h3>
            <p>Controlled scenarios to practice safe exploitation and analysis.</p>
          </article>

          <article className="feature-card">
            <div className="feature-emoji">🤝</div>
            <h3>Community & Guides</h3>
            <p>Step-by-step guides, recommended reading, and a community for support.</p>
          </article>
        </div>
      </section>

      <section className="section cta-strip">
        <h3>Ready to start?</h3>
        <p className="muted">Jump into a sandbox or try a beginner CTF within minutes.</p>
        <button className="btn primary" onClick={onExplore}>Get started</button>
      </section>
    </div>
  )
}
