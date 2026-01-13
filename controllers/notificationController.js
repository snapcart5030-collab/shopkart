const Notification = require("../models/Notification");

// GET all
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
  } catch {
    res.status(500).json({ success: false });
  }
};

// CREATE
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
  } catch {
    res.status(500).json({ success: false });
  }
};

// DELETE ONE
exports.deleteOneNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// DELETE ALL
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      userId: req.user.uid
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// LOGIN NOTIFICATION
exports.createLoginNotification = async (req, res) => {
  try {
    await Notification.create({
      userId: req.user.uid,
      title: "Login Successful",
      message: "You have logged in successfully"
    });

    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};
