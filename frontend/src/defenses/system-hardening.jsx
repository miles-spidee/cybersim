import React, { useState, useRef, useEffect } from "react";
import "../pages/Defense.css";

export default function SystemHardening() {
  const [input, setInput] = useState("");
  const [outputs, setOutputs] = useState([]);
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [booted, setBooted] = useState(false);

  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const initialChecklist = [
    { id: "firewall", title: "Enable firewall (ufw)", done: false, hint: "sudo ufw enable" },
    { id: "update", title: "Update & upgrade packages", done: false, hint: "sudo apt update && sudo apt upgrade" },
    { id: "sshd", title: "Disable root SSH login", done: false, hint: "sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config && sudo systemctl restart sshd" },
    { id: "chmod", title: "Secure /root permissions", done: false, hint: "chmod 700 /root" },
    { id: "guest", title: "Disable guest account", done: false, hint: "sudo systemctl disable guest-account" },
  ];
  const [checklist, setChecklist] = useState(initialChecklist);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const scrollBottom = () => {
    requestAnimationFrame(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    });
  };

  const pushOut = async (text, type = "out") => {
    setOutputs((o) => [...o, { type, text }]);
    await delay(10);
    scrollBottom();
  };

  const markDone = (id) =>
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: true } : c))
    );

  const computeProgress = () => {
    const done = checklist.filter((c) => c.done).length;
    return Math.round((done / checklist.length) * 100);
  };

  const COMMANDS = [
    {
      match: (cmd) => /^(sudo\s+ufw\s+enable)$/.test(cmd),
      run: async () => {
        await pushOut("Setting up firewall rules...");
        await delay(700);
        await pushOut("Firewall enabled and default policies applied.");
        markDone("firewall");
      },
    },
    {
      match: (cmd) => /^(sudo\s+apt\s+update)(\s*&&\s*sudo\s+apt\s+upgrade)?$/.test(cmd),
      run: async (cmd) => {
        await pushOut("Fetching package lists...");
        await delay(900);
        await pushOut("Reading package lists... Done");
        if (/upgrade/.test(cmd)) {
          await delay(800);
          await pushOut("Upgrading system packages... Done");
          markDone("update");
        }
      },
    },
    {
      match: (cmd) => /^(chmod\s+700\s+\/root)$/.test(cmd) || /^(sudo\s+chmod\s+700\s+\/root)$/.test(cmd),
      run: async () => {
        await pushOut("Permissions for /root updated to 700.");
        markDone("chmod");
      },
    },
    {
      match: (cmd) => /(PermitRootLogin)/.test(cmd) || /(sshd)/.test(cmd),
      run: async () => {
        await pushOut("Editing sshd_config and restarting sshd service...");
        await delay(800);
        await pushOut("Root SSH login disabled.");
        markDone("sshd");
      },
    },
    {
      match: (cmd) => /^(sudo\s+systemctl\s+disable\s+guest-account)$/.test(cmd),
      run: async () => {
        await pushOut("Guest account disabled successfully.");
        markDone("guest");
      },
    },
    {
      match: (cmd) => /^(checklist)$/.test(cmd),
      run: async () => {
        const lines = checklist
          .map((c) => `${c.done ? "[x]" : "[ ]"} ${c.title}`)
          .join("\n");
        await pushOut(lines);
      },
    },
    {
      match: (cmd) => /^(status)$/.test(cmd),
      run: async () => {
        const pct = computeProgress();
        await pushOut(`System Hardening Progress: ${pct}%`);
      },
    },
    {
      match: (cmd) => /^(help|\?)$/.test(cmd),
      run: async () => {
        await pushOut(
          "Available Commands:\n" +
            "- sudo ufw enable\n" +
            "- sudo apt update && sudo apt upgrade\n" +
            "- chmod 700 /root\n" +
            "- sudo systemctl disable guest-account\n" +
            "- sed/sshd changes\n" +
            "- checklist\n" +
            "- status"
        );
      },
    },
  ];

  const handleCommand = async (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setInput("");
    setOutputs((o) => [...o, { type: "cmd", text: `$ ${cmd}` }]);
    setIsProcessing(true);

    const match = COMMANDS.find((c) => c.match(cmd));
    if (match) await match.run(cmd);
    else await pushOut(`bash: ${cmd.split(" ")[0]}: command not found`, "err");

    setIsProcessing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
    }
  };

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 600);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (booted) return;
    const boot = async () => {
      await pushOut("Welcome to Cybersim — System Hardening Lab (simulated)", "sys");
      await delay(400);
      await pushOut("Type 'help' for a list of commands.", "sys");
      await delay(400);
      await pushOut("This environment is simulated and will not modify your real system.", "sys");
      await delay(400);
      await pushOut("Start by enabling the firewall and updating packages.", "sys");
      setBooted(true);
    };
    boot();
  }, [booted]);

  return (
    <div className="defense-wrapper">
      <div className="defense-container session-layout session-column">
        <aside className="how-to">
          <h3>How to play — System Hardening</h3>
          <ol>
            <li>Click into the terminal and run commands suggested by the checklist (e.g. <code>sudo ufw enable</code>).</li>
            <li>Use <code>sudo apt update && sudo apt upgrade</code> to simulate updates.</li>
            <li>When a checklist item performs successfully it will be marked done and progress will increase.</li>
            <li>Goal: reach 100% hardening by completing all checklist items.</li>
          </ol>
          <div className="tip">Tip: type <code>help</code> in the terminal to see supported commands.</div>
        </aside>

        <div className="terminal-panel">
          <div ref={terminalRef} className="terminal-output">
            {outputs.map((o, i) => (
              <TerminalLine key={i} {...o} />
            ))}

            <div className="terminal-input-line">
              <span className="prompt">arunaw@cybersim:~$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="terminal-input"
                spellCheck={false}
                autoFocus
              />
              <span className="cursor">{cursorVisible ? "█" : " "}</span>
            </div>
          </div>
          <div className="terminal-footer">
            <span>Use Tab for autocomplete • ↑↓ for history • Enter to run</span>
            <button onClick={() => setOutputs([])}>Clear</button>
          </div>
        </div>

        <aside className="status-panel">
          <h2>System Status</h2>
          <div className="progress-bar">
            <div style={{ width: `${computeProgress()}%` }}></div>
          </div>
          <p className="progress-text">{computeProgress()}% hardened</p>

          <h3>Checklist</h3>
          <ul>
            {checklist.map((c) => (
              <li key={c.id}>
                <span className={c.done ? "done" : ""}>
                  {c.done ? "✔" : "○"} {c.title}
                </span>
                <div className="hint">Hint: {c.hint}</div>
              </li>
            ))}
          </ul>

          <div className="log-footer">
            <p>Logs: {history.length} commands run</p>
            <button onClick={() => setInput("sudo ufw enable")}>Try: Enable Firewall</button>
          </div>
        </aside>
      </div>
    </div>
  );

  function TerminalLine({ type, text }) {
    const color =
      type === "cmd"
        ? "cmd"
        : type === "err"
        ? "err"
        : type === "sys"
        ? "sys"
        : "out";
    return <pre className={`line ${color}`}>{text}</pre>;
  }
}
