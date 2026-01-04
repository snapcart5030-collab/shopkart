// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  login,
  verifyEmailOtp
} = require("../controllers/authController");

router.post("/login", login);
router.post("/verify-otp", verifyEmailOtp);

module.exports = router;
