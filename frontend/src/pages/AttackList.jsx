import React from "react";
import { useNavigate } from "react-router-dom";

export default function AttackList() {
  const navigate = useNavigate();

  const attacks = [
    {
      id: 1,
      name: "⚔️ SQL Injection",
      path: "/attack/sql",
      highlight: true,
      description: "Exploit vulnerable input fields to inject malicious SQL queries.",
    },
    {
      id: 2,
      name: "📄 File Read",
      path: "/attack/file-read",
      highlight: false,
      description: "Simulated file-download endpoint and directory traversal style demo.",
    },
    {
      id: 3,
      name: "🖥️ Reflected XSS",
      path: "/attack/xss",
      highlight: false,
      description: "Client-side reflected XSS simulation demonstrating unsafe echoing of input.",
    },
    {
      id: 4,
      name: "🧭 Mini CTF (CLI)",
      path: "/attack/ctf",
      highlight: false,
      description: "Small command-line CTF to practice basic linux-like exploration and flag retrieval.",
    },
    {
      id: 5,
      name: "🔎 Traversal CTF",
      path: "/attack/traversal",
      highlight: false,
      description: "Find hidden files in a simulated filesystem using find/ls/cat commands.",
    },
  ];

  return (
    <div
      className="attack-list text-white text-center"
      style={{
        minHeight: "100vh",
        paddingTop: "120px", // ✅ adds space below navbar
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-red-400">⚔️ Attack Labs</h1>
      <p className="text-gray-400 mb-10">
        Choose an attack scenario to begin your offensive simulation.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {attacks.map((attack) => (
          <div
            key={attack.id}
            onClick={() => navigate(attack.path)}
            className={`attack-card relative cursor-pointer w-80 rounded-2xl transition-all duration-300 ${attack.highlight ? 'highlight' : ''}`}
            style={{
              background: "rgba(17,25,48,0.85)",
              border: attack.highlight
                ? "1px solid rgba(239,68,68,0.18)"
                : "1px solid rgba(255,255,255,0.08)",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            {/* 🔥 Red Glow Overlay — will be shown on hover via CSS when the card has .highlight */}
            {attack.highlight && (
              <div className="glow-overlay" />
            )}

            {/* Card content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 className="text-xl font-semibold mb-2">{attack.name}</h2>
              <p className="text-gray-300">{attack.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
