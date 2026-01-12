const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { createNotification } = require("./notificationController");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { mobile, name, email } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    const exists = await User.findOne({ mobile });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      mobile,
      name,
      email
    });

    const token = generateToken(user._id);

    // 🔔 Notification on Register
    await createNotification(
      user._id.toString(),
      "Welcome! Your account has been created 🎉"
    );

    res.status(201).json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    let user = await User.findOne({ mobile });

    // Auto-create user if not exists
    if (!user) {
      user = await User.create({ mobile });

      // 🔔 Notification for first-time login
      await createNotification(
        user._id.toString(),
        "Account created and logged in successfully 🎉"
      );
    } else {
      // 🔔 Notification for normal login
      await createNotification(
        user._id.toString(),
        "Login successful 🎉"
      );
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
