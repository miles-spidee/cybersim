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
import SingleAttackSession from "./attacks/atk1";
import Learn from "./pages/Learn";
import Defense from "./pages/Defense";
import Login from "./pages/Login";

// =============== Navigation Bar ===============
function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

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
        <Link to="/login" className="nav-link login">
          Log in
        </Link>
      </div>
    </nav>
  );
}

// =============== Home Page ===============
function Home() {
  return (
    <main className="main-placeholder">
      <div className="card center-card">
        <h1>Welcome to Cybersim</h1>
        <p className="lead">
          A learning platform for cybersecurity — rebuilding the UI from scratch.
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
        <h2>Platform highlights</h2>
        <ul>
          <li>Interactive sandboxed labs</li>
          <li>Beginner → advanced CTF tracks</li>
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

  // Add background only for non-login pages
  const isLoginPage = location.pathname === "/login";

  return (
    <div id="root" className={!isLoginPage ? "app-bg" : "app-login"}>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route
          path="/attack"
          element={
            <main style={{ paddingTop: "1.25rem" }}>
              <SingleAttackSession onClose={() => (window.location.href = "/")} />
            </main>
          }
        />
        <Route path="/defense" element={<Defense />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/get-started"
          element={
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <h1>Get Started Page</h1>
              <p>Coming soon!</p>
            </div>
          }
        />
        <Route
          path="/articles"
          element={
            <div style={{ padding: "3rem", textAlign: "center" }}>
              <h1>Articles Page</h1>
              <p>Community-driven content coming soon.</p>
            </div>
          }
        />
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
