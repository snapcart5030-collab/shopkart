const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware"); // ✅ FIX

const {
  sendMessage,
  getMessages,
  deleteMessage
} = require("../controllers/contactController");

// ➕ Send contact message (LOGIN REQUIRED)
router.post("/", protect, sendMessage);

// 📥 Get all messages (Admin)
router.get("/", getMessages);

// ❌ Delete message (Admin)
router.delete("/:id", deleteMessage);

module.exports = router;
