const Notification = require("../models/Notification");

// CREATE
const createNotification = async (userId, message) => {
  await Notification.create({ userId, message });
};

// GET
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    userId: req.user.id   // ✅ FIX HERE
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: notifications
  });
};

// DELETE
const deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

module.exports = {
  createNotification,
  getNotifications,
  deleteNotification
};
