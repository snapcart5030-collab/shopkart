const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  deleteMessage
} = require("../controllers/contactController");

// ➕ Send contact message
router.post("/", sendMessage);

// 📥 Get all messages (admin)
router.get("/", getMessages);

// ❌ Delete message
router.delete("/:id", deleteMessage);

module.exports = router;
