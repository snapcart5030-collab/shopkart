// controllers/userController.js
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  res.json(await User.findById(req.user.id));
};

exports.updateProfile = async (req, res) => {
  res.json(await User.findByIdAndUpdate(req.user.id, req.body, { new: true }));
};
