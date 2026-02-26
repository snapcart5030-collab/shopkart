const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // 👈 ADD THIS LINE
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

// ================= GET ALL USERS =================
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE PROFILE =================
router.put(
  "/profile",
  protect,
  upload.single("photo"),   // 👈 NOW FIXED
  async (req, res) => {
    try {
      console.log("BODY:", req.body);  // debug
      console.log("FILE:", req.file);  // debug

      const { name, mobile, gender, age } = req.body;

      const updateData = {
        name: name || "",
        mobile: mobile || "",
        gender: gender || null,
        age: age ? Number(age) : null,
      };

      // If new photo uploaded
      if (req.file) {
        updateData.photo = `/uploads/profile/${req.file.filename}`;
      }

      const user = await User.findOneAndUpdate(
        { uid: req.user.uid },
        updateData,
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
  }
);

module.exports = router;