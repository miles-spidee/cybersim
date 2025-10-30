import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defenseModules = [
  {
    id: 1,
    title: 'Network Defense',
    description: 'Learn how to secure networks and defend against attacks',
    icon: '🌐',
    steps: [
      'Enable and configure a firewall',
      'Set up intrusion detection systems',
      'Monitor network traffic for anomalies',
      'Implement secure VPN access',
      'Regularly update network devices'
    ],
    completed: false
  },
  {
    id: 2,
    title: 'System Hardening',
    description: 'Secure systems and prevent unauthorized access',
    icon: '🔒',
    steps: [
      'Disable unnecessary services',
      'Apply the principle of least privilege',
      'Enable disk encryption',
      'Configure automatic updates',
      'Implement secure authentication'
    ],
    completed: false
  },
  {
    id: 3,
    title: 'Incident Response',
    description: 'Effectively respond to security incidents',
    icon: '🚨',
    steps: [
      'Create an incident response plan',
      'Establish communication protocols',
      'Contain and eradicate threats',
      'Collect and analyze evidence',
      'Document lessons learned'
    ],
    completed: false
  }
];

function Defense() {
  const [activeModule, setActiveModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const navigate = useNavigate();

  const startModule = (module) => {
    setActiveModule({ ...module, steps: [...module.steps] });
    setProgress(0);
    setCurrentStep(0);
    setShowCompletion(false);
  };

  const completeStep = () => {
    if (!activeModule) return;
    
    const newStep = currentStep + 1;
    if (newStep >= activeModule.steps.length) {
      setShowCompletion(true);
      setActiveModule({ ...activeModule, completed: true });
    } else {
      setCurrentStep(newStep);
      setProgress(Math.round((newStep / activeModule.steps.length) * 100));
      setTaskCompleted(false);
      setUserInput('');
      setSelectedOptions([]);
    }
  };

  const resetModule = () => {
    setActiveModule(null);
    setProgress(0);
    setCurrentStep(0);
    setShowCompletion(false);
  };

  if (activeModule) {
    return (
      <div className="defense-module">
        <div className="module-header">
          <button onClick={resetModule} className="btn ghost">
            ← Back to Defense Training
          </button>
          <h2>{activeModule.icon} {activeModule.title}</h2>
          <p>{activeModule.description}</p>
          
          {!showCompletion ? (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Step {currentStep + 1} of {activeModule.steps.length}
              </div>
            </div>
          ) : (
            <div className="completion-badge">
              🎉 Module Completed!
            </div>
          )}
        </div>

        {!showCompletion ? (
          <div className="module-step">
            <h3>Step {currentStep + 1}: {activeModule.steps[currentStep]}</h3>
            <div className="step-content">
                  {activeModule.id === 1 && (
                    <div className="simulation-panel">
                      <h4>Network Configuration</h4>
                      <div className="network-visual">
                        <div className="network-node server">
                          <div className="node-icon">🖥️</div>
                          <div className="node-label">Web Server</div>
                          <div className="node-status">
                            {currentStep >= 1 ? (
                              <span className="status-dot active"></span>
                            ) : (
                              <label className="checkbox-container">
                                <input 
                                  type="checkbox" 
                                  checked={taskCompleted}
                                  onChange={(e) => setTaskCompleted(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                              </label>
                            )}
                            Firewall
                          </div>
                          <div className="node-status">
                            {currentStep >= 2 ? (
                              <span className="status-dot active"></span>
                            ) : currentStep === 1 ? (
                              <label className="checkbox-container">
                                <input 
                                  type="checkbox" 
                                  checked={taskCompleted}
                                  onChange={(e) => setTaskCompleted(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                              </label>
                            ) : (
                              <span className="status-dot"></span>
                            )}
                            IDS
                          </div>
                        </div>
                        <div className="network-connector"></div>
                        <div className="network-node client">
                          <div className="node-icon">🌍</div>
                          <div className="node-label">Internet</div>
                        </div>
                      </div>
                      {currentStep === 0 && !taskCompleted && (
                        <div className="task-prompt">
                          <p>Enable the firewall by checking the box above to proceed.</p>
                        </div>
                      )}
                      {currentStep === 1 && !taskCompleted && (
                        <div className="task-prompt">
                          <p>Enable the Intrusion Detection System (IDS) by checking the box above to proceed.</p>
                        </div>
                      )}
                    </div>
                  )}
              
              {activeModule.id === 2 && (
                <div className="system-task">
                  {currentStep === 0 && (
                    <div className="terminal">
                      <div className="terminal-header">System Security Scanner</div>
                      <div className="terminal-content">
                        <div className="command-line">
                          <span className="prompt">$</span> scan-system --security
                        </div>
                        <div className="output">
                          Scanning system for security vulnerabilities...
                          {taskCompleted && (
                            <>
                              <br />
                              <br />
                              <div className="scan-result critical">
                                <span className="result-icon">✖</span>
                                <span className="result-text">Vulnerable services detected: 3</span>
                              </div>
                              <div className="scan-result warning">
                                <span className="result-icon">!</span>
                                <span className="result-text">Outdated software: 5 packages</span>
                              </div>
                              <div className="scan-result success">
                                <span className="result-icon">✓</span>
                                <span className="result-text">Firewall: Active</span>
                              </div>
                              <br />
                              <div>Scan completed. {activeModule.steps[currentStep]}</div>
                            </>
                          )}
                        </div>
                      </div>
                      {!taskCompleted && (
                        <button 
                          className="btn primary" 
                          onClick={() => setTaskCompleted(true)}
                        >
                          Run Security Scan
                        </button>
                      )}
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="security-checklist">
                      <h4>Disable Unnecessary Services</h4>
                      <p>Select which services to disable:</p>
                      {[
                        { id: 'ftp', name: 'FTP Server', description: 'Unencrypted file transfer protocol' },
                        { id: 'telnet', name: 'Telnet', description: 'Unencrypted remote access' },
                        { id: 'samba', name: 'Samba', description: 'File sharing service' },
                        { id: 'bluetooth', name: 'Bluetooth', description: 'Wireless communication' },
                        { id: 'httpd', name: 'Web Server', description: 'Not needed on workstations' }
                      ].map((service) => (
                        <label key={service.id} className="security-option">
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              const selected = e.target.checked
                                ? [...selectedOptions, service.id]
                                : selectedOptions.filter(id => id !== service.id);
                              setSelectedOptions(selected);
                              setTaskCompleted(selected.length >= 3);
                            }}
                          />
                          <div className="option-details">
                            <div className="option-title">{service.name}</div>
                            <div className="option-description">{service.description}</div>
                          </div>
                        </label>
                      ))}
                      {selectedOptions.length > 0 && selectedOptions.length < 3 && (
                        <p className="hint">Select at least 3 services to disable</p>
                      )}
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="encryption-setup">
                      <h4>Enable Disk Encryption</h4>
                      <div className="progress-indicator">
                        <div 
                          className="progress-bar" 
                          style={{ width: taskCompleted ? '100%' : '0%' }}
                        ></div>
                      </div>
                      <p>Encrypting system drive...</p>
                      {!taskCompleted && (
                        <button 
                          className="btn primary"
                          onClick={() => {
                            setTaskCompleted(true);
                            // Simulate encryption progress
                            const interval = setInterval(() => {
                              setProgress(prev => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  return 100;
                                }
                                return prev + 10;
                              });
                            }, 300);
                          }}
                        >
                          Start Encryption
                        </button>
                      )}
                      {taskCompleted && (
                        <div className="success-message">
                          ✓ Disk encryption completed successfully
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {activeModule.id === 3 && (
                <div className="incident-response">
                  <h4>Incident Details</h4>
                  <div className="incident-card">
                    <div className="incident-severity high">HIGH SEVERITY</div>
                    <div className="incident-title">Suspicious Login Attempts</div>
                    <div className="incident-details">
                      <div><strong>Source IP:</strong> 192.168.1.45</div>
                      <div><strong>Time:</strong> {new Date().toLocaleString()}</div>
                      <div><strong>Status:</strong> {currentStep >= 3 ? 'Contained' : 'Active'}</div>
                    </div>
                    {currentStep === 0 && (
                      <div className="incident-action">
                        <button className="btn primary" onClick={completeStep}>
                          Acknowledge Incident
                        </button>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="incident-action">
                        <button className="btn primary" onClick={completeStep}>
                          Block Suspicious IP
                        </button>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="incident-action">
                        <button className="btn primary" onClick={completeStep}>
                          Reset Affected Accounts
                        </button>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="incident-action">
                        <button className="btn primary" onClick={completeStep}>
                          Document Incident
                        </button>
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="incident-action">
                        <button className="btn primary" onClick={completeStep}>
                          Complete Response
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="step-actions">
                {activeModule.id === 1 && (
                  <button 
                    className={`btn ${taskCompleted ? 'primary' : 'disabled'}`}
                    onClick={completeStep}
                    disabled={!taskCompleted}
                  >
                    {currentStep < activeModule.steps.length - 1 ? 'Next Step' : 'Complete Module'}
                  </button>
                )}
                {activeModule.id === 2 && (
                  <div className="system-task">
                    {currentStep === 0 && (
                      <div className="task-input">
                        <p>Enter the command to list all running services:</p>
                        <input 
                          type="text" 
                          value={userInput}
                          onChange={(e) => {
                            setUserInput(e.target.value);
                            setTaskCompleted(e.target.value.toLowerCase() === 'net start');
                          }}
                          placeholder="Enter command..."
                        />
                        {userInput && !taskCompleted && (
                          <p className="hint">Hint: Use 'net start' to list running services</p>
                        )}
                      </div>
                    )}
                    <button 
                      className={`btn ${taskCompleted ? 'primary' : 'disabled'}`}
                      onClick={completeStep}
                      disabled={!taskCompleted}
                    >
                      {currentStep < activeModule.steps.length - 1 ? 'Next Step' : 'Complete Module'}
                    </button>
                  </div>
                )}
                {activeModule.id === 3 && (
                  <button 
                    className="btn primary"
                    onClick={completeStep}
                  >
                    {currentStep < activeModule.steps.length - 1 ? 'Next Step' : 'Complete Module'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="module-complete">
            <div className="celebration">🎉</div>
            <h3>Great job!</h3>
            <p>You've completed the {activeModule.title} training module.</p>
            <div className="completion-actions">
              <button className="btn primary" onClick={resetModule}>
                Back to Defense Training
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="defense-container">
      <div className="defense-header">
        <h1>Defense Training</h1>
        <p>Learn how to protect systems and networks from cyber threats</p>
      </div>
      
      <div className="training-options">
        {defenseModules.map((module) => (
          <div key={module.id} className={`training-card ${module.completed ? 'completed' : ''}`}>
            <div className="card-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div className="module-stats">
              <span className="module-steps">{module.steps.length} steps</span>
              {module.completed && <span className="module-completed">✓ Completed</span>}
            </div>
            <button 
              className={`btn ${module.completed ? 'ghost' : 'primary'}`}
              onClick={() => startModule(module)}
            >
              {module.completed ? 'Review Again' : 'Start Learning'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="defense-actions">
        <button className="btn ghost" onClick={() => navigate('/learn')}>
          ← Back to Learning Paths
        </button>
      </div>
    </div>
  );
}

export default Defense;
