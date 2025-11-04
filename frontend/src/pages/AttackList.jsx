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
            className="relative cursor-pointer w-80 rounded-2xl transition-all duration-300"
            style={{
              background: "rgba(17,25,48,0.85)",
              border: attack.highlight
                ? "1px solid rgba(239,68,68,0.8)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: attack.highlight
                ? "0 0 25px 4px rgba(239,68,68,0.6)"
                : "0 0 12px rgba(0,0,0,0.3)",
              padding: "2rem",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              if (attack.highlight) {
                e.currentTarget.style.boxShadow =
                  "0 0 40px 8px rgba(239,68,68,0.9)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              if (attack.highlight) {
                e.currentTarget.style.boxShadow =
                  "0 0 25px 4px rgba(239,68,68,0.6)";
              }
            }}
          >
            {/* 🔥 Red Glow Overlay */}
            {attack.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  bottom: "-10px",
                  left: "-10px",
                  right: "-10px",
                  borderRadius: "20px",
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(239,68,68,0.3), transparent 70%)",
                  zIndex: 0,
                  filter: "blur(20px)",
                }}
              ></div>
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
