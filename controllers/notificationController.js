const Notification = require("../models/Notification");

/**
 * @desc    Get all notifications (on login)
 * @route   GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.uid
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

/**
 * @desc    Create notification (optional – admin/system)
 */
exports.createNotification = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notification = await Notification.create({
      userId: req.user.uid,
      title,
      message
    });

    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });
  }
};

/**
 * @desc    Delete single notification
 * @route   DELETE /api/notifications/:id
 */
exports.deleteOneNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification"
    });
  }
};

/**
 * @desc    Delete all notifications
 * @route   DELETE /api/notifications
 */
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      userId: req.user.uid
    });

    res.status(200).json({
      success: true,
      message: "All notifications deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete all notifications"
    });
  }
};


exports.createLoginNotification = async (req, res) => {
  try {
    await Notification.create({
      userId: req.user.uid,
      title: "Login Successful",
      message: "You have logged in successfully"
    });

    res.status(201).json({
      success: true,
      message: "Login notification created"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create login notification"
    });
  }
};

