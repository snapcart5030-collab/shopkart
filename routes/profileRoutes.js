// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");

// GET profile
router.get("/", protect, async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST - Create profile (for registration)
router.post("/", protect, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ uid: req.user.uid });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }
    
    // Create new user
    const user = new User({
      uid: req.user.uid,
      email: req.user.email,
      name: name || "",
      mobile: mobile || "",
      role: "user"
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: "Profile created successfully",
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error(error);
    
    if (error.code === 11000 && error.keyPattern.mobile) {
      return res.status(400).json({ 
        success: false, 
        message: "Mobile number already registered" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT - Update profile
router.put("/", protect, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        name: name || "",
        mobile: mobile || "",
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
    
  } catch (error) {
    console.error(error);
    
    if (error.code === 11000 && error.keyPattern.mobile) {
      return res.status(400).json({ 
        success: false, 
        message: "Mobile number already registered" 
      });
    }
    
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;