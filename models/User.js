const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, "UID is required"],
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    default: "",
    trim: true,
  },
  mobile: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: false });
userSchema.index({ mobile: 1 }, { sparse: true });

const User = mongoose.model("User", userSchema);

module.exports = User;