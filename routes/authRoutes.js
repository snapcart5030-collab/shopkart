const express = require("express");
const router = express.Router();
const { register, login, getCurrentUser,checkEmail } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/check-email", checkEmail);

// Protected routes
router.get("/me", protect, getCurrentUser);

module.exports = router;