import express from "express";
import pool from "../config/db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields (name, email, password) are required" });
  }

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ msg: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Both email and password are required" });
  }

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

// ✅ Get User Info by ID
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Fetch user error:", err);
    res.status(500).json({ msg: "Failed to fetch user details", error: err.message });
  }
});

// ✅ Change Password by User ID
router.put("/change-password/:id", async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "Both current and new passwords are required" });
  }

  try {
    const userRes = await pool.query("SELECT password FROM users WHERE id = $1", [id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, userRes.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashed, id]);

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Password update error:", err);
    res.status(500).json({ msg: "Failed to update password", error: err.message });
  }
});

export default router;
