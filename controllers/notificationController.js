const Notification = require("../models/Notification");

/**
 * CREATE NOTIFICATION
 * (Login success, Order success etc.)
 */
const createNotification = async (userId, message) => {
  try {
    await Notification.create({
      userId,
      message
    });
  } catch (error) {
    console.error("❌ Notification create error:", error.message);
  }
};

/**
 * GET USER NOTIFICATIONS
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.uid
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

/**
 * DELETE NOTIFICATION
 */
const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  deleteNotification
};
