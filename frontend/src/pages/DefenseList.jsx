import React from "react";
import { useNavigate } from "react-router-dom";

export default function DefenseList() {
  const navigate = useNavigate();

  const defenses = [
    {
      id: 1,
      name: "🛡️ OS System Hardening",
      path: "/defense/system-hardening",
      highlight: true, // 🌟 highlight this one
      description: "Secure your operating system by locking down vulnerabilities.",
    },
    {
      id: 2,
      name: "📊 IDS Monitor",
      path: "/defense/ids-monitor",
      highlight: false,
      description: "Monitor simulated IDS alerts and triage suspicious events.",
    },
    {
      id: 3,
      name: "📜 Log Analysis",
      path: "/defense/log-analysis",
      highlight: false,
      description: "Search and analyze system logs to find anomalies.",
    },
  ];

  return (
    <div
      className="defense-list text-white text-center"
      style={{
        minHeight: "100vh",
        paddingTop: "120px", // ✅ gives space below navbar
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-blue-400">🛡️ Defense Labs</h1>
      <p className="text-gray-400 mb-10">
        Choose a defensive simulation to secure and harden your systems.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {defenses.map((defense) => (
          <div
            key={defense.id}
            onClick={() => navigate(defense.path)}
            className={`attack-card relative cursor-pointer w-80 rounded-2xl transition-all duration-300 ${defense.highlight ? 'highlight defense-highlight' : ''}`}
            style={{
              background: "rgba(17,25,48,0.85)",
              border: defense.highlight
                ? "1px solid rgba(147, 51, 234, 0.18)"
                : "1px solid rgba(255,255,255,0.08)",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            {/* Purple Glow Overlay — controlled via CSS on hover */}
            {defense.highlight && <div className="glow-overlay" />}

            {/* Card content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 className="text-xl font-semibold mb-2">{defense.name}</h2>
              <p className="text-gray-300">{defense.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
