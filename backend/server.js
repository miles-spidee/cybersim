// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// --- Basic checks / required envs ---
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 6060;

// Connect DB
connectDB();

// --- Security middlewares ---
app.use(helmet());
app.use(express.json({ limit: "10kb" })); // limit JSON body size
app.use(cookieParser());

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS: allow the frontend origin and support credentials
const allowedOrigins = (process.env.ALLOWED_ORIGINS || FRONTEND_URL).split(",");
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// --- Routes ---
app.use("/api/auth", authLimiter, authRoutes);

// Example health route
app.get("/health", (req, res) => res.json({ status: "ok", time: Date.now() }));

// Global error handler for uncaught errors (basic)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.message ? err.message : err);
  res.status(500).json({ message: "Server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
