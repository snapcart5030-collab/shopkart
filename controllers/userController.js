// controllers/userController.js
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, photo, gender, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, mobile, photo, gender, age },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};