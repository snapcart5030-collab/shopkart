const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const {
  getNotifications,
  deleteNotification
} = require("../controllers/notificationController");

// 🔔 Get logged-in user notifications
router.get("/", protect, getNotifications);

// ❌ Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
