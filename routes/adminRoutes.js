const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// ================= ADMIN SCHEMA (INLINE) =================
const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

// ================= ADMIN REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      status: "pending", // 🔒 NOT APPROVED YET
    });

    res.json({
      message: "Admin registered. Waiting for approval",
    });
  } catch (err) {
    console.error("ADMIN REGISTER ERROR:", err);
    res.status(500).json({ message: "Admin register failed" });
  }
});

// ================= ADMIN LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (admin.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Admin not permitted. Approval pending." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: "admin",
      name: admin.name,
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
});

// ================= GET ALL ADMINS =================
router.get("/list", async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});

// ================= APPROVE ADMIN =================
router.put("/approve/:id", async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "Admin approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
});

module.exports = router;
