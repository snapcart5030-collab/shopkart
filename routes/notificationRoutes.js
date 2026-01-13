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

router.use(protect);

router.get("/", getNotifications);
router.post("/", createNotification);
router.post("/login", createLoginNotification);
router.delete("/:id", deleteOneNotification);
router.delete("/", deleteAllNotifications);

module.exports = router;
