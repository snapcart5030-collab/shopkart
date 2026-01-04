const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");

// 🔢 Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 📧 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ==============================
// 📩 LOGIN → SEND EMAIL OTP
// ==============================
exports.login = async (req, res) => {
  try {
    const { mobile, email } = req.body;

    if (!mobile || !email) {
      return res.status(400).json({
        message: "Mobile and email are required"
      });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile, email });
    } else {
      user.email = email;
    }

    const otp = generateOTP();

    user.emailOtp = otp;
    user.emailOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isEmailVerified = false;

    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Email OTP",
      html: `<h2>Your OTP is <b>${otp}</b></h2>`
    });

    res.json({
      success: true,
      message: "OTP sent to email",
      userId: user._id
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==============================
// ✅ VERIFY EMAIL OTP → JWT TOKEN
// ==============================
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        message: "UserId and OTP are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (
      user.emailOtp !== otp ||
      !user.emailOtpExpiry ||
      user.emailOtpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.isEmailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;

    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
