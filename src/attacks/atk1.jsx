import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function SingleAttackSession({ onClose }) {
  const [sessionActive, setSessionActive] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [flag, setFlag] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [log, setLog] = useState([
    'Initializing attack simulation...',
    'Connected to target system (192.168.1.100)',
    'Running initial scan...',
    'Port 22/tcp open - SSH (OpenSSH 8.2p1)',
    'Port 80/tcp open - HTTP (Apache/2.4.41)'
  ]);
  const [progress, setProgress] = useState(0);
  const [foundVulnerabilities, setFoundVulnerabilities] = useState([
    { id: 1, name: 'Weak SSH Credentials', severity: 'High', found: false },
    { id: 2, name: 'Outdated Apache Version', severity: 'Medium', found: false },
    { id: 3, name: 'Default Credentials on Admin Panel', severity: 'Critical', found: false }
  ]);
  const [showFlagInput, setShowFlagInput] = useState(false);
  const navigate = useNavigate();
  const terminalRef = React.useRef(null);

  // Auto-scroll terminal to bottom when new logs are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  // Simulate scanning progress
  useEffect(() => {
    if (!sessionActive) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionActive(false);
          setLog(prev => [...prev, 'Session expired! Time is up.']);
          return 0;
        }
        return prev - 1;
      });

      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 5, 100);
        
        // Simulate finding vulnerabilities at certain progress points
        if (newProgress > 30 && !foundVulnerabilities[0].found) {
          setLog(prev => [...prev, 'Found potential vulnerability: Weak SSH Credentials']);
          setFoundVulnerabilities(prev => 
            prev.map(vuln => 
              vuln.id === 1 ? { ...vuln, found: true } : vuln
            )
          );
        }
        
        if (newProgress > 60 && !foundVulnerabilities[1].found) {
          setLog(prev => [...prev, 'Found potential vulnerability: Outdated Apache Version']);
          setFoundVulnerabilities(prev => 
            prev.map(vuln => 
              vuln.id === 2 ? { ...vuln, found: true } : vuln
            )
          );
        }
        
        if (newProgress > 90 && !foundVulnerabilities[2].found) {
          setLog(prev => [...prev, 'Found critical vulnerability: Default Credentials on Admin Panel']);
          setFoundVulnerabilities(prev => 
            prev.map(vuln => 
              vuln.id === 3 ? { ...vuln, found: true } : vuln
            )
          );
        }
        
        if (newProgress >= 100 && !showFlagInput) {
          setShowFlagInput(true);
          setLog(prev => [...prev, 'Vulnerability scan complete!']);
          setLog(prev => [...prev, 'Flag: flag{cyb3rs1m_r0cks!} (This would be hidden in a real scenario)']);
        }
        
        return newProgress;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [sessionActive, foundVulnerabilities, showFlagInput]);

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    if (flag.toLowerCase() === 'flag{cyb3rs1m_r0cks!}') {
      setMsg({ text: '✅ Flag submitted successfully! Challenge completed!', type: 'success' });
      setLog(prev => [...prev, 'Flag verified! Challenge completed successfully!']);
      setTimeout(() => navigate('/learn'), 2000);
    } else {
      setMsg({ text: '❌ Invalid flag. Try again!', type: 'error' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const startNewSession = () => {
    setSessionActive(true);
    setSecondsLeft(300);
    setFlag('');
    setMsg({ text: '', type: '' });
    setLog([
      'Initializing new attack simulation...',
      'Connected to target system (192.168.1.100)',
      'Running initial scan...',
      'Port 22/tcp open - SSH (OpenSSH 8.2p1)',
      'Port 80/tcp open - HTTP (Apache/2.4.41)'
    ]);
    setProgress(0);
    setFoundVulnerabilities(prev => 
      prev.map(vuln => ({ ...vuln, found: false }))
    );
    setShowFlagInput(false);
  };

  return (
    <div className="attack-container">
      <div className="attack-header">
        <div className="header-content">
          <h2>Penetration Testing Lab</h2>
          <div className="session-info">
            <span className="session-timer">⏱️ {formatTime(secondsLeft)}</span>
            <span className="session-status">
              Status: <span className={sessionActive ? 'status-active' : 'status-inactive'}>
                {sessionActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </span>
          </div>
        </div>
        {!sessionActive && !showFlagInput && (
          <button onClick={startNewSession} className="btn primary">
            Start New Session
          </button>
        )}
      </div>
      
      <div className="attack-content">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="red"></span>
              <span className="yellow"></span>
              <span className="green"></span>
            </div>
            <div className="terminal-title">attack-simulator@cybersim:~$</div>
          </div>
          <div className="terminal-content" ref={terminalRef}>
            {log.map((entry, i) => (
              <div key={i} className="log-entry">
                <span className="prompt">$</span> {entry}
              </div>
            ))}
            {progress < 100 && sessionActive && (
              <div className="log-entry">
                <span className="prompt">$</span> Scanning... {Math.round(progress)}%
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            {!sessionActive && !showFlagInput && (
              <div className="log-entry">
                <span className="prompt">$</span> Session inactive. Start a new session to continue.
              </div>
            )}
          </div>
        </div>
        
        <div className="vulnerability-list">
          <h3>Vulnerabilities Found</h3>
          {foundVulnerabilities.map(vuln => (
            <div key={vuln.id} className={`vulnerability-item ${vuln.found ? 'found' : ''}`}>
              <div className={`vuln-severity ${vuln.severity.toLowerCase()}`}>
                {vuln.severity}
              </div>
              <div className="vuln-name">
                {vuln.name}
                {vuln.found && <span className="checkmark">✓</span>}
              </div>
            </div>
          ))}
        </div>
        
        {showFlagInput ? (
          <div className="flag-submission">
            <h3>Submit Your Flag</h3>
            <p>You've found all vulnerabilities! Submit the flag to complete the challenge.</p>
            <form onSubmit={handleFlagSubmit} className="flag-form">
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="flag{...}"
                className="flag-input"
                autoFocus
              />
              <button type="submit" className="btn primary">
                Submit Flag
              </button>
            </form>
            {msg.text && (
              <div className={`message ${msg.type}`}>
                {msg.text}
              </div>
            )}
            <div className="hint">
              <small>Hint: The flag is <code>flag&#123;cyb3rs1m_r0cks!&#125;</code> (visible for demo purposes)</small>
            </div>
          </div>
        ) : !sessionActive ? (
          <div className="session-inactive">
            <p>Your session has ended. Start a new session to continue.</p>
            <button onClick={startNewSession} className="btn primary">
              Start New Session
            </button>
          </div>
        ) : null}
        
        <div className="session-actions">
          <button 
            onClick={onClose || (() => navigate('/learn'))} 
            className="btn ghost"
          >
            ← Back to Learn
          </button>
        </div>
      </div>
    </div>
  );
}
