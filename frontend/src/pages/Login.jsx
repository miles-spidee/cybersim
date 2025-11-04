import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Register state
  const [username, setUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Message states
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const BASE_URL = "http://localhost:6060/api/auth"; // your backend

  // ==================== HANDLE LOGIN ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Authenticating...");
    setIsError(false);

    try {
      console.log("Sending login request to:", `${BASE_URL}/login`);
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || `Login failed with status ${res.status}`);
      }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      // ✅ Save token + user object to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/profile"), 1000); // ✅ redirect to Profile page
    } catch (err) {
      console.error("Login error:", err);
      setIsError(true);
      setMessage(`❌ ${err.message || "An error occurred during login"}`);
    }
  };

  // ==================== HANDLE REGISTER ====================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !registerEmail.trim() || !registerPassword) {
      setIsError(true);
      setMessage("⚠️ All fields are required!");
      return;
    }

    if (registerPassword.length < 6) {
      setIsError(true);
      setMessage("⚠️ Password must be at least 6 characters long!");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setIsError(true);
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    setMessage("Creating account...");
    setIsError(false);

    try {
      console.log("Sending registration request with:", {
        username,
        email: registerEmail,
      });
      const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: registerEmail.trim().toLowerCase(),
          password: registerPassword,
        }),
      });

      const data = await res.json();
      console.log("Registration response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(
          data.message || `Registration failed with status ${res.status}`
        );
      }

      // Clear fields on success
      setUsername("");
      setRegisterEmail("");
      setRegisterPassword("");
      setConfirmPassword("");

      setMessage("🎉 Account created successfully! Please log in.");
      setTimeout(() => setTab("login"), 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setIsError(true);
      setMessage(`❌ ${err.message || "An error occurred during registration"}`);
    }
  };

  // ==================== FRONTEND UI ====================
  return (
    <div
      className="app-login"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* 🟣 Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.4)",
          color: "var(--accent)",
          padding: "0.5rem 1.2rem",
          borderRadius: "8px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 10px rgba(124,58,237,0.3)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(124,58,237,0.25)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(124,58,237,0.12)")
        }
      >
        ← Back
      </button>

      {/* 🔰 Header */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          color: "var(--text)",
          letterSpacing: "0.05em",
          marginBottom: "0.5rem",
        }}
      >
        Cybersim
      </h1>
      <p
        style={{
          color: "var(--muted)",
          maxWidth: "600px",
          fontSize: "0.95rem",
          marginBottom: "2rem",
          lineHeight: "1.6",
        }}
      >
        A next-gen platform to learn cybersecurity by defending real systems,
        mastering attacks, and hardening environments — safely and interactively.
      </p>

      {/* 🛡️ Shield Icon */}
      <div
        style={{
          position: "relative",
          marginBottom: "2rem",
          animation: "pulseGlow 2.5s infinite ease-in-out",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)",
            filter: "blur(10px)",
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "75px",
            height: "75px",
            color: "var(--accent)",
            filter: "drop-shadow(0 0 20px rgba(124,58,237,0.6))",
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3l8.5 4v6c0 5-3.5 9-8.5 9S3.5 18 3.5 13V7l8.5-4z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4"
          />
        </svg>
      </div>

      {/* 🧩 Login/Register Card */}
      <div
        className="login-card"
        style={{
          background: "rgba(11,18,32,0.7)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "2rem",
          width: "360px",
          boxShadow: "0 0 40px rgba(124,58,237,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            padding: "4px",
          }}
        >
          <button
            onClick={() => setTab("login")}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                tab === "login"
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.02)",
              color: tab === "login" ? "white" : "var(--muted)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background:
                tab === "register"
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.02)",
              color: tab === "register" ? "white" : "var(--muted)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
          >
            Register
          </button>
        </div>

        {/* ================= LOGIN ================= */}
        {tab === "login" && (
          <form onSubmit={handleLogin}>
            <h2
              style={{
                color: "var(--text)",
                fontWeight: "700",
                fontSize: "1.4rem",
                marginBottom: "1rem",
              }}
            >
              Welcome Back
            </h2>

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
              <span style={toggleStyle} onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" style={btnPrimary}>
              Sign In
            </button>

            {message && (
              <p
                className={`message ${isError ? "error" : "success"}`}
                style={{ marginTop: "1rem" }}
              >
                {message}
              </p>
            )}

            <p style={altLink}>
              Don’t have an account?{" "}
              <span
                onClick={() => setTab("register")}
                style={{ color: "var(--accent)", cursor: "pointer" }}
              >
                Create one
              </span>
            </p>
          </form>
        )}

        {/* ================= REGISTER ================= */}
        {tab === "register" && (
          <form onSubmit={handleRegister}>
            <h2
              style={{
                color: "var(--text)",
                fontWeight: "700",
                fontSize: "1.4rem",
                marginBottom: "1rem",
              }}
            >
              Create Account
            </h2>

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              style={inputStyle}
            />

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Email
            </label>
            <input
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showRegPass ? "text" : "password"}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                style={inputStyle}
              />
              <span
                style={toggleStyle}
                onClick={() => setShowRegPass(!showRegPass)}
              >
                {showRegPass ? "🙈" : "👁️"}
              </span>
            </div>

            <label style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                style={inputStyle}
              />
              <span
                style={toggleStyle}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" style={btnPrimary}>
              Create Account
            </button>

            {message && (
              <p
                className={`message ${isError ? "error" : "success"}`}
                style={{ marginTop: "1rem" }}
              >
                {message}
              </p>
            )}

            <p style={altLink}>
              Already have an account?{" "}
              <span
                onClick={() => setTab("login")}
                style={{ color: "var(--accent)", cursor: "pointer" }}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ===== Inline Styles =====
const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  outline: "none",
};

const toggleStyle = {
  position: "absolute",
  right: "12px",
  top: "14px",
  cursor: "pointer",
  color: "var(--muted)",
};

const btnPrimary = {
  width: "100%",
  padding: "0.8rem",
  marginTop: "0.5rem",
  borderRadius: "10px",
  border: "none",
  background: "var(--accent)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const altLink = {
  fontSize: "0.9rem",
  marginTop: "1rem",
  color: "var(--muted)",
};
