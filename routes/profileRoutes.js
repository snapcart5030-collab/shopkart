const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const { protect } = require("../middlewares/authMiddleware");

// 👤 Get profile
router.get("/", protect, getProfile);

// ✏ Update profile
router.put("/", protect, updateProfile);

module.exports = router;
