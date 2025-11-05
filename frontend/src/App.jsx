import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// ==== Page Imports ====
import SingleAttackSession from "./attacks/atk1";
import Attack2 from "./attacks/atk2";
import Attack3 from "./attacks/atk3";
import Attack4 from "./attacks/atk4";
import Attack5 from "./attacks/atk5";
import Learn from "./pages/Learn";
import AttackList from "./pages/AttackList";
import DefenseList from "./pages/DefenseList";
import Defense from "./pages/Defense";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import Profile from "./pages/Profile";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import IDSMonitor from "./defenses/ids-monitor";
import LogAnalysis from "./defenses/log-analysis";
import SystemHardening from "./defenses/system-hardening";

// =============== Navigation Bar ===============
function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="top-nav">
      <div className="brand">
        <span className="brand-text">Cybersim</span>
      </div>

      <div className="nav-actions">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          Home
        </Link>

        <Link
          to="/get-started"
          className={`nav-link ${isActive("/get-started") ? "active" : ""}`}
        >
          Get started
        </Link>

        <Link
          to="/articles"
          className={`nav-link ${isActive("/articles") ? "active" : ""}`}
        >
          Articles
        </Link>

        <Link
          to="/learn"
          className={`nav-link ${
            location.pathname.startsWith("/learn") ||
            location.pathname.startsWith("/attack") ||
            location.pathname.startsWith("/defense")
              ? "active"
              : ""
          }`}
        >
          Learn
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
            >
              {user.username || "Profile"}
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link logout-btn"
              style={{
                background: "none",
                border: "none",
                color: "#f55",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link login">
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}

// =============== Home Page ===============
function Home() {
  return (
    <main className="main-placeholder fade-in">
      <div className="card center-card">
        <h1>Welcome to Cybersim</h1>
        <p className="lead">
          A learning platform for cybersecurity — building skills through
          real-world simulated environments.
        </p>
        <div className="actions">
          <Link to="/get-started" className="btn primary">
            Get started
          </Link>
          <Link to="/learn" className="btn ghost">
            Learn more
          </Link>
        </div>
      </div>

      <section className="unique-features">
        <h2>Platform Highlights</h2>
        <ul>
          <li>Interactive sandboxed labs</li>
          <li>Beginner → Advanced CTF tracks</li>
          <li>Linux command games and exercises</li>
          <li>Step-by-step writeups and community guides</li>
        </ul>
      </section>
    </main>
  );
}

// =============== App Component ===============
function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div id="root" className={!isLoginPage ? "app-bg" : "app-login"}>
      <Navigation />
      <Routes>
        {/* 🌍 General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🎓 Learning Routes */}
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/attack" element={<AttackList />} />
        <Route path="/learn/defense" element={<DefenseList />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:topic" element={<ArticleDetail />} />


        {/* ⚔️ Attack Labs */}
        <Route
          path="/attack/sql"
          element={<SingleAttackSession title="SQL Injection Lab" />}
        />
        <Route
          path="/attack/file-read"
          element={<Attack2 />}
        />
        <Route
          path="/attack/xss"
          element={<Attack3 />}
        />
        <Route
          path="/attack/ctf"
          element={<Attack4 />}
        />
        <Route
          path="/attack/traversal"
          element={<Attack5 />}
        />
        <Route
          path="/attack/phishing"
          element={<SingleAttackSession title="Phishing Simulation" />}
        />

        {/* 🛡️ Defense Labs */}
        <Route
          path="/defense/system-hardening"
          element={<SystemHardening />}
        />
        <Route
          path="/defense/firewall"
          element={<Defense title="Firewall Configuration Lab" />}
        />
        <Route
          path="/defense/network-security"
          element={<Defense title="Network Security Lab" />}
        />
        <Route path="/defense/ids-monitor" element={<IDSMonitor />} />
        <Route path="/defense/log-analysis" element={<LogAnalysis />} />
      </Routes>
    </div>
  );
}

// =============== Export ===============
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
