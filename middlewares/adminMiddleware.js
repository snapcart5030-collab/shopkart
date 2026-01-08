const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};
