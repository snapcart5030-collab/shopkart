const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController");

// GET profile
router.get("/", protect, getProfile);

// UPDATE profile (photo optional)
router.put(
  "/",
  protect,
  upload.single("photo"),
  updateProfile
);

// DELETE profile
router.delete("/", protect, deleteProfile);

module.exports = router;
