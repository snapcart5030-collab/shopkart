const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      unique: true,
      required: true
    },

    name: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    // 🔐 OTP STRUCTURE (ADD THIS)
    emailOtp: {
      type: String
    },
    emailOtpExpiry: {
      type: Date
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
