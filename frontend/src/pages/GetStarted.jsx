import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div
      className="getstarted-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* 🟣 HEADER */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "var(--accent)",
          textShadow: "0 0 15px rgba(124,58,237,0.4)",
        }}
      >
        Welcome to Cybersim
      </h1>

      <p
        style={{
          color: "var(--muted)",
          maxWidth: "700px",
          marginTop: "1rem",
          marginBottom: "3rem",
          lineHeight: "1.6",
          fontSize: "1.1rem",
        }}
      >
        Step into your own cyber lab. Practice real-world attack and defense
        techniques in a safe, simulated environment. Strengthen your cybersecurity
        skills and learn how to protect systems from threats.
      </p>

      {/* 🧩 MODULE CARDS */}
      <div
        className="getstarted-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          maxWidth: "900px",
          width: "100%",
          marginBottom: "3rem",
        }}
      >
        {/* ATTACK */}
        <div
          className="getstarted-card"
          onClick={() => navigate("/attack")}
          style={cardStyle}
        >
          <div style={iconWrapper}>
            <span style={iconStyle}>⚔️</span>
          </div>
          <h2 style={cardTitle}>Attack Simulations</h2>
          <p style={cardDesc}>
            Learn offensive security — simulate cyberattacks to understand how
            hackers exploit systems.
          </p>
          <button style={btnPrimary}>Start Attack Lab</button>
        </div>

        {/* DEFENSE */}
        <div
          className="getstarted-card"
          onClick={() => navigate("/defense")}
          style={cardStyle}
        >
          <div style={iconWrapper}>
            <span style={iconStyle}>🛡️</span>
          </div>
          <h2 style={cardTitle}>Defense Modules</h2>
          <p style={cardDesc}>
            Learn system hardening, firewall setup, and patch management — secure
            your virtual system step by step.
          </p>
          <button style={btnPrimary}>Start Defense Lab</button>
        </div>

        {/* LEARN */}
        <div
          className="getstarted-card"
          onClick={() => navigate("/learn")}
          style={cardStyle}
        >
          <div style={iconWrapper}>
            <span style={iconStyle}>📘</span>
          </div>
          <h2 style={cardTitle}>Learn & Practice</h2>
          <p style={cardDesc}>
            Explore theory, cybersecurity basics, and guided tutorials to master
            core defensive and offensive skills.
          </p>
          <button style={btnPrimary}>Explore Lessons</button>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "var(--text)", fontSize: "1.4rem" }}>
          Ready to Begin Your Cyber Journey?
        </h3>
        <button
          onClick={() => navigate("/login")}
          style={{
            marginTop: "1.2rem",
            padding: "0.8rem 2rem",
            background: "var(--accent)",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 0 15px rgba(124,58,237,0.4)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 25px rgba(124,58,237,0.7)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 15px rgba(124,58,237,0.4)")
          }
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

/* 🎨 Inline Styles */
const cardStyle = {
  background: "rgba(11,18,32,0.8)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "2rem",
  color: "var(--text)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(124,58,237,0.08)",
  backdropFilter: "blur(10px)",
};
const iconWrapper = {
  marginBottom: "1rem",
};
const iconStyle = {
  fontSize: "2rem",
};
const cardTitle = {
  fontSize: "1.4rem",
  fontWeight: "700",
  color: "var(--accent)",
  marginBottom: "0.5rem",
};
const cardDesc = {
  color: "var(--muted)",
  fontSize: "0.95rem",
  lineHeight: "1.5",
  marginBottom: "1.2rem",
};
const btnPrimary = {
  padding: "0.6rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

