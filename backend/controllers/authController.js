const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const {
  formatUser,
  normalizeEmail,
  validateRegisterPayload,
  validateLoginPayload,
} = require("../models/User");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const registerUser = async (req, res) => {
  try {
    const validationError = validateRegisterPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const name = req.body.name.trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [result.insertId]
    );
    const user = formatUser(rows[0]);

    res.status(201).json({
      message: "Registration successful",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const validationError = validateLoginPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    const [rows] = await db.query(
      "SELECT id, name, email, password, created_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRow = rows[0];
    const isPasswordValid = await bcrypt.compare(password, userRow.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = formatUser(userRow);

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: formatUser(rows[0]) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
