const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const {
  getProfile,
  createProfile,
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
 * @route   POST /api/profile
 * @desc    Create/Register user profile
 * @access  Private
 */
router.post("/", protect, createProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/", protect, updateProfile);

/**
 * @route   DELETE /api/profile
 * @desc    Delete user profile
 * @access  Private
 */
router.delete("/", protect, deleteProfile);

module.exports = router;