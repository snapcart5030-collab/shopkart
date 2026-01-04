const User = require("../models/User");
const Contact = require("../models/Contact");
const Comment = require("../models/Comment");

// 📊 Dashboard counts
exports.dashboard = async (req, res) => {
  const users = await User.countDocuments({ role: "user" });
  const admins = await User.countDocuments({ role: "admin" });
  const contacts = await Contact.countDocuments();
  const comments = await Comment.countDocuments();

  res.json({ users, admins, contacts, comments });
};

// 👥 Get all users
exports.getUsers = async (req, res) => {
  res.json(await User.find({ role: "user" }));
};

// 🔁 Change role (user ↔ admin)
exports.changeRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );

  res.json(user);
};

// ❌ Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
