const User = require("../models/User");

// 👤 GET PROFILE
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-__v");
  res.json(user);
};

// ✏ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  );

  res.json(updatedUser);
};

