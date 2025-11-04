import React from "react";
import { useNavigate } from "react-router-dom";

export default function Learn() {
  const navigate = useNavigate();

  const cardStyle = {
    background: "rgba(17,25,48,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "2rem",
    width: "300px",
    textAlign: "center",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const container = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
    minHeight: "80vh",
  };

  return (
    <div className="learn-page" style={{ textAlign: "center", color: "white" }}>
      <h1 className="text-4xl font-bold mt-8 text-purple-400">Choose Your Path</h1>
      <p className="text-gray-400 mt-2 mb-12">
        Learn cybersecurity by attacking or defending real systems.
      </p>

      <div style={container}>
        {/* Attack card */}
        <div
          onClick={() => navigate("/learn/attack")}
          style={{
            ...cardStyle,
            boxShadow: "0 0 20px rgba(255, 0, 100, 0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <h2 className="text-2xl font-semibold mb-3">⚔️ Attack Labs</h2>
          <p>Practice offensive security, hacking, and penetration testing.</p>
        </div>

        {/* Defense card */}
        <div
          onClick={() => navigate("/learn/defense")}
          style={{
            ...cardStyle,
            boxShadow: "0 0 20px rgba(100, 0, 255, 0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <h2 className="text-2xl font-semibold mb-3">🛡️ Defense Labs</h2>
          <p>Harden systems, analyze threats, and defend against attacks.</p>
        </div>
      </div>
    </div>
  );
}
