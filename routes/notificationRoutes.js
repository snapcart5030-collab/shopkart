const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");



const {
  getNotifications,
  createNotification,
  deleteOneNotification,
  deleteAllNotifications,
  createLoginNotification
} = require("../controllers/notificationController");

// All routes protected
router.use(protect);

// Get notifications on login
router.get("/", getNotifications);

// Create notification (optional)
router.post("/", createNotification);

// Delete one
router.delete("/:id", deleteOneNotification);

// Delete all
router.delete("/", deleteAllNotifications);
router.post("/login", createLoginNotification);
module.exports = router;
