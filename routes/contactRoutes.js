const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  sendMessage,
  getMessages,
  replyMessage,
  getMyMessages
} = require("../controllers/contactController");

/* =========================
   USER ROUTES (LOGIN REQUIRED)
========================= */

// User send message
router.post("/", protect, sendMessage);

// User get own chat
router.get("/my", protect, getMyMessages);


/* =========================
   ADMIN ROUTES (NO LOGIN)
========================= */

// Admin get all user chats
router.get("/admin", getMessages);

// Admin reply to user
router.post("/admin/reply/:id", replyMessage);

module.exports = router;
