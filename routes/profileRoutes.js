const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");

/**
 * @route   GET /api/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    // 🆕 First login → auto create user
    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
      });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
      message: "Profile fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/profile
 * @desc    Create profile manually (optional)
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { name, mobile } = req.body;

    let user = await User.findOne({ uid: req.user.uid });
    if (user) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    user = await User.create({
      uid: req.user.uid,
      email: req.user.email,
      name: name || "",
      mobile: mobile || "",
    });

    res.status(201).json({
      message: "Profile created successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update profile (name, mobile)
 * @access  Private
 */
router.put("/", protect, async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        name: name ?? "",
        mobile: mobile ?? "",
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/profile
 * @desc    Delete user profile (DB only)
 * @access  Private
 */
router.delete("/", protect, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      message: "Profile deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
