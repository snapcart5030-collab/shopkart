const generateToken = require("../utils/generateToken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { mobile } = req.body;

  let user = await User.findOne({ mobile });
  if (!user) {
    user = await User.create({ mobile });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user
  });
};
