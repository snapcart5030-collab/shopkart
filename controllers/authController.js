const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER
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

    const user = await User.create({ mobile, name, email });

    const token = generateToken(user._id);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile });
    }

    const token = generateToken(user._id);

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
