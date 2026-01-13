const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

const {
  sendMessage,
  getMessages,
  replyMessage,
  getMyMessages
} = require("../controllers/contactController");

/* ===== USER ===== */
router.post("/", protect, sendMessage);
router.get("/my", protect, getMyMessages);

/* ===== ADMIN ===== */
router.get("/", protect, isAdmin, getMessages);
router.post("/reply/:id", protect, isAdmin, replyMessage);

module.exports = router;
