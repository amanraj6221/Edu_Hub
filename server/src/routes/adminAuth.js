import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

// Middleware to protect dashboard
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exist = await Admin.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({ message: "Registered successfully", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard (protected)
router.get("/dashboard", verifyToken, async (req, res) => {
  const admin = await Admin.findById(req.adminId).select("-password");
  if (!admin) return res.status(404).json({ message: "Admin not found" });
  res.json({ message: `Welcome, ${admin.username}!` });
});

export default router;
