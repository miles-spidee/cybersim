import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Defense.css';

const defenseModules = [
  {
    id: 1,
    title: 'System Hardening Lab',
    description: 'Interactive system security hardening environment',
    icon: '🔒',
    steps: [
      'Scan system for vulnerabilities',
      'Disable unnecessary services',
      'Configure firewall rules',
      'Enable disk encryption',
      'Set up secure authentication'
    ],
    completed: false,
    labEnvironment: {
      services: [
        { id: 'ftp', name: 'FTP Server', running: true, port: 21, description: 'Unencrypted file transfer protocol' },
        { id: 'telnet', name: 'Telnet', running: true, port: 23, description: 'Unencrypted remote access' },
        { id: 'samba', name: 'Samba', running: true, port: 445, description: 'File sharing service' },
        { id: 'bluetooth', name: 'Bluetooth', running: true, port: null, description: 'Wireless communication' },
        { id: 'httpd', name: 'Web Server', running: false, port: 80, description: 'Not needed on workstations' }
      ],
      firewall: {
        enabled: false,
        rules: []
      },
      encryption: {
        enabled: false,
        progress: 0
      },
      authentication: {
        passwordPolicy: 'weak',
        mfaEnabled: false
      }
    }
  }
];

function Defense() {
  const [activeModule, setActiveModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([
    '=== System Hardening Lab ===',
    'Type "help" to see available commands',
    'Type "start" to begin the lab',
    ''
  ]);
  const [labState, setLabState] = useState(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Initialize lab state when module starts
  useEffect(() => {
    if (activeModule?.labEnvironment) {
      const initialState = JSON.parse(JSON.stringify(activeModule.labEnvironment));
      setLabState(initialState);
      setOutput([
        '=== System Hardening Lab ===',
        `Current Task: ${activeModule.steps[0]}`,
        'Type "help" to see available commands',
        ''
      ]);
    }
  }, [activeModule]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [output]);

  const executeCommand = (cmd) => {
    if (!cmd.trim()) return;
    const newOutput = [...output, `$ ${cmd}`];
    const args = cmd.trim().split(' ');
    const baseCmd = args[0].toLowerCase();

    switch (baseCmd) {
      case 'help':
        newOutput.push('Available commands:');
        newOutput.push('  help              - Show this help message');
        newOutput.push('  start             - Begin the lab');
        newOutput.push('  scan system       - Scan for vulnerabilities');
        newOutput.push('  list services     - List all running services');
        newOutput.push('  stop <service>    - Stop a service (e.g., stop ftp)');
        newOutput.push('  firewall status   - Check firewall status');
        newOutput.push('  firewall enable   - Enable the firewall');
        newOutput.push('  encrypt start     - Start disk encryption');
        newOutput.push('  clear             - Clear the terminal');
        newOutput.push('  next              - Proceed to next step');
        break;

      case 'start':
        newOutput.push('Starting lab environment...');
        newOutput.push('Type "scan system" to begin vulnerability assessment');
        setTaskCompleted(true);
        break;

      case 'scan':
        if (args[1] === 'system') {
          newOutput.push('Scanning system for vulnerabilities...');
          newOutput.push('Found 5 security issues:');
          newOutput.push('1. FTP service running (insecure protocol)');
          newOutput.push('2. Telnet service running (insecure protocol)');
          newOutput.push('3. Samba service running (potential vulnerability)');
          newOutput.push('4. Bluetooth service running (potential attack vector)');
          newOutput.push('5. Firewall is disabled');
          newOutput.push('\nRun "list services" to see all running services');
          setTaskCompleted(true);
        } else newOutput.push('Unknown command. Type "help" for available commands.');
        break;

      case 'list':
        if (args[1] === 'services' && labState) {
          newOutput.push('Running services:');
          labState.services.forEach(s => {
            if (s.running) newOutput.push(`- ${s.name} (${s.id}) - Port: ${s.port || 'N/A'} - ${s.description}`);
          });
          newOutput.push('\nUse "stop <service>" to disable a service');
        } else newOutput.push('Unknown command. Type "help" for available commands.');
        break;

      case 'stop':
        if (args[1] && labState) {
          const service = labState.services.find(s => s.id === args[1]);
          if (service) {
            service.running = false;
            newOutput.push(`Stopped ${service.name} service`);
            const vulnerableServices = labState.services.filter(s =>
              ['ftp', 'telnet', 'samba', 'bluetooth'].includes(s.id)
            );
            const allStopped = vulnerableServices.every(s => !s.running);
            if (allStopped) {
              newOutput.push('All vulnerable services have been disabled!');
              setTaskCompleted(true);
            }
          } else newOutput.push(`Service "${args[1]}" not found`);
        } else newOutput.push('Please specify a service to stop');
        break;

      case 'firewall':
        if (args[1] === 'status') {
          newOutput.push(`Firewall is ${labState?.firewall.enabled ? 'enabled' : 'disabled'}`);
          if (labState?.firewall.rules.length > 0) {
            newOutput.push('Active rules:');
            labState.firewall.rules.forEach(rule => newOutput.push(`- ${rule}`));
          }
        } else if (args[1] === 'enable') {
          if (labState) {
            labState.firewall.enabled = true;
            labState.firewall.rules = [
              'Allow SSH (port 22)',
              'Allow HTTP (port 80)',
              'Allow HTTPS (port 443)',
              'Block all other incoming connections'
            ];
            newOutput.push('Firewall enabled with secure rules');
            setTaskCompleted(true);
          }
        } else newOutput.push('Unknown firewall command. Use "firewall status" or "firewall enable"');
        break;

      case 'encrypt':
        if (args[1] === 'start') {
          newOutput.push('Starting disk encryption...');
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setOutput(prev => [...prev.slice(0, -1), `Encryption in progress: ${progress}%`]);
            if (progress >= 100) {
              clearInterval(interval);
              setOutput(prev => [...prev.slice(0, -1), '✅ Disk encryption completed successfully']);
              setTaskCompleted(true);
              if (labState) {
                setLabState({
                  ...labState,
                  encryption: { ...labState.encryption, enabled: true, progress: 100 }
                });
              }
            }
          }, 500);
        } else newOutput.push('Unknown command. Use "encrypt start" to begin disk encryption.');
        break;

      case 'clear':
        setOutput(['=== Terminal cleared ===', '']);
        return;

      case 'next':
        if (taskCompleted) {
          completeStep();
          return;
        } else newOutput.push('Please complete the current task before proceeding.');
        break;

      default:
        newOutput.push(`Command not found: ${cmd}`);
        newOutput.push('Type "help" for a list of available commands');
    }

    setOutput(newOutput);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && command.trim()) {
      executeCommand(command);
      setCommand('');
    }
  };

  const startModule = (module) => {
    setActiveModule(module);
    setCurrentStep(0);
    setProgress(0);
    setTaskCompleted(false);
    setShowCompletion(false);
    setCommand('');
    setOutput([
      '=== System Hardening Lab ===',
      `Current Task: ${module.steps[0]}`,
      'Type "help" to see available commands',
      ''
    ]);
  };

  const completeStep = () => {
    if (!activeModule) return;
    const newStep = currentStep + 1;

    if (newStep >= activeModule.steps.length) {
      const newOutput = [
        ...output,
        '',
        '🎉 All tasks completed successfully!',
        '✅ System hardening lab finished.',
        "Type 'exit' or click 'Return to Start' to restart."
      ];
      setOutput(newOutput);
      setShowCompletion(true);
      setActiveModule({ ...activeModule, completed: true });
      return;
    }

    setCurrentStep(newStep);
    setProgress(Math.round((newStep / activeModule.steps.length) * 100));
    setTaskCompleted(false);
    const newOutput = [...output, ''];

    switch (newStep) {
      case 1:
        newOutput.push('=== Step 2: Disable Unnecessary Services ===');
        break;
      case 2:
        newOutput.push('=== Step 3: Configure Firewall ===');
        break;
      case 3:
        newOutput.push('=== Step 4: Enable Disk Encryption ===');
        break;
      case 4:
        newOutput.push('=== Step 5: Secure Authentication ===');
        setTaskCompleted(true);
        break;
      default:
        break;
    }
    setOutput(newOutput);
  };

  const resetModule = () => {
    setActiveModule(null);
    setProgress(0);
    setCurrentStep(0);
    setShowCompletion(false);
    setTaskCompleted(false);
    setCommand('');
    setOutput([
      '=== System Hardening Lab ===',
      'Type "help" to see available commands',
      'Type "start" to begin the lab',
      ''
    ]);
  };

  // === COMPLETION SCREEN ===
  if (showCompletion) {
    return (
      <div className="completion-screen">
        <div className="success-animation">
          <div className="checkmark">✓</div>
        </div>
        <h2>Lab Completed Successfully! 🎉</h2>
        <p>You've successfully hardened the system by:</p>
        <ul className="achievements">
          <li>✓ Scanned for vulnerabilities</li>
          <li>✓ Disabled unnecessary services</li>
          <li>✓ Configured the firewall</li>
          <li>✓ Enabled disk encryption</li>
          <li>✓ Set up secure authentication</li>
        </ul>
        <div className="completion-actions">
          <button className="btn primary" onClick={resetModule}>
            🔁 Return to Start
          </button>
          <button className="btn ghost" onClick={() => navigate('/learn')}>
            Back to Learning Paths
          </button>
        </div>
      </div>
    );
  }

  // === INITIAL SCREEN ===
  if (!activeModule) {
    return (
      <div className="defense-lab-container">
        <div className="defense-header">
          <h1>Security Hardening Lab</h1>
          <p>Practice real-world system hardening techniques in a safe, interactive environment</p>
        </div>

        <div className="lab-intro">
          <div className="lab-card">
            <div className="lab-card-header">
              <span className="lab-card-icon">🔒</span>
              <h3>System Hardening Lab</h3>
            </div>
            <p className="lab-description">
              Learn how to secure systems by identifying and fixing vulnerabilities, configuring firewalls, 
              and implementing strong authentication mechanisms.
            </p>
            <button className="btn primary" onClick={() => startModule(defenseModules[0])}>
              Start Lab
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === ACTIVE LAB VIEW ===
  return (
    <div className="defense-lab active">
      <div className="lab-header">
        <div className="lab-nav">
          <h3>{activeModule.title}</h3>
          <div className="lab-progress">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <button className="btn ghost" onClick={resetModule}>Exit Lab</button>
        </div>
      </div>

      <div className="lab-container">
        {/* Terminal */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="terminal-btn close"></span>
              <span className="terminal-btn minimize"></span>
              <span className="terminal-btn maximize"></span>
            </div>
            <div className="terminal-title">terminal@security-lab</div>
          </div>
          <div className="terminal-content" ref={terminalRef}>
            {output.map((line, i) => <p key={i} className="terminal-line">{line}</p>)}
          </div>
          <div className="terminal-input">
            <span className="prompt">$</span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              ref={inputRef}
              autoFocus
            />
          </div>
        </div>

        {/* ✅ Right-Side Panel */}
        <div className="status-panel">
          <h3>System Status</h3>
          <div className="status-card">
            <p>Firewall</p>
            <span className={`status ${labState?.firewall.enabled ? 'ok' : 'bad'}`}>
              {labState?.firewall.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="status-card">
            <p>Disk Encryption</p>
            <span className={`status ${labState?.encryption.enabled ? 'ok' : 'warn'}`}>
              {labState?.encryption.enabled ? 'Enabled' : 'Not Encrypted'}
            </span>
          </div>
          <div className="status-card">
            <p>Vulnerable Services</p>
            <span className={`status ${labState?.services?.filter(s => s.running && ['ftp','telnet','samba','bluetooth'].includes(s.id)).length === 0 ? 'ok' : 'bad'}`}>
              {labState?.services?.filter(s => s.running && ['ftp','telnet','samba','bluetooth'].includes(s.id)).length || 0} Active
            </span>
          </div>
          <div className="status-card">
            <p>Authentication</p>
            <span className="status warn">Needs Improvement</span>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Defense;
