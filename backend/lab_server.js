// backend/lab_server.js
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

const PORT = 7070;
const DB_FILE = "./lab_demo.sqlite";

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
app.post("/api/lab/login", async (req, res) => {
  const { username = "", password = "" } = req.body;
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  const sql = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  try {
    const row = await db.get(sql);
    if (!row) return res.status(401).json({ message: "Invalid credentials" });
    let flag = null;
    if (row.is_admin) {
      const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
      flag = meta?.value;
    }
    res.json({ user: { username: row.username, is_admin: !!row.is_admin }, flag });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  } finally {
    await db.close();
  }
});

// ---------- secure (parameterized) ----------
app.post("/api/lab/login-secure", async (req, res) => {
  const { username = "", password = "" } = req.body;
  const db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  try {
    const row = await db.get(
      "SELECT * FROM users WHERE username=? AND password=?",
      [username, password]
    );
    if (!row) return res.status(401).json({ message: "Invalid credentials" });
    let flag = null;
    if (row.is_admin) {
      const meta = await db.get("SELECT value FROM metadata WHERE key='flag'");
      flag = meta?.value;
    }
    res.json({ user: { username: row.username, is_admin: !!row.is_admin }, flag });
  } catch (err) {
    res.status(500).json({ message: "Error: " + err.message });
  } finally {
    await db.close();
  }
});

app.listen(PORT, async () => {
  await initDb();
  console.log(`✅ Lab SQL demo running on http://localhost:${PORT}`);
  console.log(`POST /api/lab/login  (insecure)`);
  console.log(`POST /api/lab/login-secure  (safe)`);
});
