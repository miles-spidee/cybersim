import React from 'react';
import './Landing.css';

export default function Landing({ onExplore }) {
  return (
    <div className="page landing">
      <header className="site-hero">
        <div className="hero-inner">
          <h1 className="hero-title">Cybersim — Learn & Practice Cybersecurity</h1>
          <p className="hero-sub">Interactive articles, CTFs, simulated attacks, and Linux command challenges — all in your browser.</p>
          <div className="hero-ctas">
            <button className="btn primary" onClick={onExplore}>Explore what we provide</button>
            <a className="btn ghost" href="#get-started">Get Started</a>
          </div>
        </div>
      </header>

      <section id="get-started" className="section">
        <div className="section-header">
          <h2>Start Your Cybersecurity Journey</h2>
          <p className="muted">Choose your path and develop practical skills through hands-on learning</p>
        </div>
        
        <div className="get-started-grid">
          <div className="get-started-card">
            <div className="card-icon">👶</div>
            <h3>Beginner's Path</h3>
            <p className="card-description">Perfect for those new to cybersecurity. Build a strong foundation with our guided learning path.</p>
            <ul className="card-features">
              <li>✓ Linux fundamentals & command line</li>
              <li>✓ Networking basics & protocols</li>
              <li>✓ Web security essentials</li>
              <li>✓ System administration basics</li>
              <li>✓ Security fundamentals</li>
            </ul>
            <div className="card-footer">
              <span className="difficulty-badge easy">Beginner</span>
              <span className="duration">4-6 weeks</span>
            </div>
            <button className="btn primary full-width">Start Learning Path</button>
          </div>
          
          <div className="get-started-card featured">
            <div className="card-badge">Most Popular</div>
            <div className="card-icon">🛡️</div>
            <h3>Interactive Labs</h3>
            <p className="card-description">Practice in realistic, safe environments with guided exercises and real-world scenarios.</p>
            <ul className="card-features">
              <li>✓ Hands-on security challenges</li>
              <li>✓ Real attack simulations</li>
              <li>✓ Defensive security exercises</li>
              <li>✓ Progress tracking</li>
              <li>✓ Instant feedback</li>
            </ul>
            <div className="card-footer">
              <span className="difficulty-badge intermediate">All Levels</span>
              <span className="duration">Self-paced</span>
            </div>
            <button className="btn primary full-width" onClick={onExplore}>Explore All Labs</button>
          </div>
          
          <div className="get-started-card">
            <div className="card-icon">🏆</div>
            <h3>CTF Challenges</h3>
            <p className="card-description">Test your skills with our Capture The Flag challenges across multiple categories.</p>
            <ul className="card-features">
              <li>✓ Web security challenges</li>
              <li>✓ Cryptography puzzles</li>
              <li>✓ Forensics exercises</li>
              <li>✓ Reverse engineering</li>
              <li>✓ Privilege escalation</li>
            </ul>
            <div className="card-footer">
              <span className="difficulty-badge advanced">Intermediate+</span>
              <span className="duration">Ongoing</span>
            </div>
            <button className="btn primary full-width">View Challenges</button>
          </div>
        </div>
        
        <div className="learning-path-cta">
          <h3>Not sure where to start?</h3>
          <p>Take our 2-minute assessment to find the perfect starting point for your skill level and interests.</p>
          <button className="btn secondary">Take Assessment</button>
        </div>
      </section>

      <section id="articles" className="section">
        <h2>Featured Articles</h2>
        <p className="muted">Expand your knowledge with our in-depth security articles</p>
        
        <div className="articles-grid">
          <article className="article-card">
            <div className="article-category">Web Security</div>
            <h3>Understanding XSS Attacks</h3>
            <p>Learn how Cross-Site Scripting works and how to prevent it in your web applications.</p>
            <div className="article-meta">15 min read • Intermediate</div>
          </article>
          
          <article className="article-card">
            <div className="article-category">Network Security</div>
            <h3>Network Traffic Analysis 101</h3>
            <p>Master the basics of analyzing network traffic for security incidents.</p>
            <div className="article-meta">20 min read • Beginner</div>
          </article>
          
          <article className="article-card">
            <div className="article-category">Linux</div>
            <h3>Essential Linux Commands for Security</h3>
            <p>Powerful command-line tools every security professional should know.</p>
            <div className="article-meta">12 min read • All Levels</div>
          </article>
        </div>
        
        <div className="view-all">
          <button className="btn ghost">View All Articles →</button>
        </div>
      </section>

      <section id="features" className="section features">
        <h2>What We Provide</h2>
        <p className="muted">Hands-on learning split into approachable modules</p>
        
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
