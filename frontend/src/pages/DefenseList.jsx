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
            className="relative cursor-pointer w-80 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(17,25,48,0.85)",
              border: defense.highlight
                ? "1px solid rgba(147, 51, 234, 0.8)" // purple border
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: defense.highlight
                ? "0 0 25px 4px rgba(124,58,237,0.6)"
                : "0 0 12px rgba(0,0,0,0.3)",
              padding: "2rem",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              if (defense.highlight) {
                e.currentTarget.style.boxShadow =
                  "0 0 40px 8px rgba(147,51,234,0.9)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              if (defense.highlight) {
                e.currentTarget.style.boxShadow =
                  "0 0 25px 4px rgba(124,58,237,0.6)";
              }
            }}
          >
            {/* 🌟 Purple Glow Overlay */}
            {defense.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  bottom: "-10px",
                  left: "-10px",
                  right: "-10px",
                  borderRadius: "20px",
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147,51,234,0.3), transparent 70%)",
                  zIndex: 0,
                  filter: "blur(20px)",
                }}
              ></div>
            )}

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
