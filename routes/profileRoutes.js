const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/profileController");

/**
 * @route   GET /api/profile
 * @desc    Get user profile (auto-creates if doesn't exist)
 * @access  Private
 */
router.get("/", protect, getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile (name, mobile)
 * @access  Private
 */
router.put("/", protect, updateProfile);

/**
 * @route   DELETE /api/profile
 * @desc    Delete user profile (from MongoDB only)
 * @access  Private
 */
router.delete("/", protect, deleteProfile);

module.exports = router;