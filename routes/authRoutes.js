const express = require("express");
const router = express.Router();
const { 
  checkEmail, 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

// Public routes
router.post("/check-email", checkEmail);
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;