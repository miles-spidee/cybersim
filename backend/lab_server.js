// backend/lab_server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

const PORT = 7070;
const DB_FILE = "./lab_demo.sqlite";

/**
 * Initialize or open the SQLite demo database.
 * Creates a users table and a metadata table with a flag when DB doesn't exist.
 */
async function initDb() {
  const exists = fs.existsSync(DB_FILE);
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  if (!exists) {
    await db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT,
        is_admin INTEGER DEFAULT 0
      );
    `);
    await db.exec(`
      CREATE TABLE metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // sample rows
    await db.run(
      "INSERT INTO users (username,password,is_admin) VALUES ('admin','supersecret',1),('alice','alicepass',0)"
    );
    await db.run(
      "INSERT INTO metadata (key,value) VALUES ('flag','flag{cybersim_local_training}')"
    );
    console.log("Created fresh lab_demo.sqlite");
  }
  return db;
}

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ---------- insecure (vulnerable) ----------
// This endpoint intentionally demonstrates string-concatenation based SQL (vulnerable).
// For the learning lab we also *detect common SQLi payloads* and return a simulated admin + flag
// so students can see the impact of SQLi without relying on specific SQLite parsing quirks.
app.post("/api/lab/login", async (req, res) => {
  const { username = "", password = "" } = req.body;

  // Build the naive (vulnerable) SQL string — keep this to show what insecure code looks like
  const sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;

  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });

  try {
    // QUICK LAB: detect some classic injection patterns used by learners and emulate the bypass.
    // This avoids false negatives caused by SQLite token parsing differences and makes the learning
    // experience consistent (i.e., payloads like: ' OR '1'='1  or ' OR 1=1).
    const normalized = (username || "").replace(/\s+/g, " ").toLowerCase();

    const injectionPatterns = [
      /' or '1'='1/i,
      /' or 1=1/i,
      /" or "1"="1/i,
      /or\s+1=1/i,
      /' or 'x'='x/i,
    ];

    const isInjection = injectionPatterns.some((r) => r.test(normalized));

    if (isInjection) {
      console.log("💥 SQL Injection payload detected (lab emulation).");
      const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
      return res.json({
        user: { username: "admin (simulated)", is_admin: true },
        flag: meta?.value || null,
        injected: true,
        message: "Authentication bypassed via SQL Injection (lab simulation).",
      });
    }

    // If no injection pattern matched, run the naive query (this may return a valid user)
    const row = await db.get(sql);

    if (!row) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let flag = null;
    if (row.is_admin) {
      const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
      flag = meta?.value || null;
    }

    return res.json({
      user: { username: row.username, is_admin: !!row.is_admin },
      flag,
      injected: false,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Insecure login error:", err && err.message ? err.message : err);
    return res.status(500).json({ message: "Error: " + (err && err.message ? err.message : err) });
  } finally {
    await db.close();
  }
});

// ---------- secure (parameterized) ----------
app.post("/api/lab/login-secure", async (req, res) => {
  const { username = "", password = "" } = req.body;
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });

  try {
    // Parameterized query - prevents SQL injection by treating inputs as data.
    const row = await db.get(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (!row) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let flag = null;
    if (row.is_admin) {
      const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
      flag = meta?.value || null;
    }

    return res.json({
      user: { username: row.username, is_admin: !!row.is_admin },
      flag,
      message: "Login successful (secure)",
    });
  } catch (err) {
    console.error("Secure login error:", err && err.message ? err.message : err);
    return res.status(500).json({ message: "Error: " + (err && err.message ? err.message : err) });
  } finally {
    await db.close();
  }
});

// Optional: simple flag endpoint (read-only)
app.get("/api/flag", async (req, res) => {
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  try {
    const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
    res.json({ flag: meta?.value || null });
  } catch (err) {
    res.status(500).json({ message: "Error reading flag" });
  } finally {
    await db.close();
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`✅ Lab SQL demo running on http://localhost:${PORT}`);
  console.log(`POST /api/lab/login  (insecure - demo)`);
  console.log(`POST /api/lab/login-secure  (safe - parameterized)`);
});
