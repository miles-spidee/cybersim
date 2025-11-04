// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";

/**
 * Helper: create JWT token
 */
function createToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/**
 * POST /api/auth/register
 * Registers a new user, hashes the password, and returns success response.
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    // Basic validation
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (typeof password !== "string" || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    // Check existing email
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashed,
    });

    await user.save();

    // Generate token
    const token = createToken({ id: user._id });

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with success + token for frontend compatibility
    return res.status(201).json({
      message: "Registration successful",
      token, // ✅ Add token here
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("registerUser error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

/**
 * POST /api/auth/login
 * Logs in a user and returns JWT + sets cookie.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    // Check user existence
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = createToken({ id: user._id });

    // Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Send token also in JSON (so frontend works)
    return res.status(200).json({
      message: "Login successful",
      token, // 🔥 Added for frontend compatibility
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("loginUser error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

/**
 * POST /api/auth/logout
 * Clears the JWT cookie.
 */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logoutUser error:", err.message);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
