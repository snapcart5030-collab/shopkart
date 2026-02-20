const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");

// ================= GET PROFILE =================
router.get("/profile", protect, async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    // 🆕 First time login → save user
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
      gender: user.gender,   // ✅ added
      age: user.age,         // ✅ added
      role: user.role,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE PROFILE =================
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, mobile, gender, age } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        name: name || "",
        mobile: mobile || "",
        gender: gender || null,   // ✅ optional
        age: age || null,         // ✅ optional
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;