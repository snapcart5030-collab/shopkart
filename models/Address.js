const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    uid: {
      type: String, // Firebase UID
      required: true,
      index: true
    },
    Name: {
      type: String,
      required: true,
      trim: true
    },
    Mobile: {
      type: String,
      required: true,
      trim: true
    },
    HNo: {
      type: String,
      required: true,
      trim: true
    },
    locality: {
      type: String,
      required: true,
      trim: true
    },
    City: {
      type: String,
      required: true,
      trim: true
    },
    State: {
      type: String,
      required: true,
      trim: true
    },
    Pincode: {
      type: String,
      required: true,
      trim: true
    },
    LandMark: {
      type: String,
      trim: true
    },
    Type: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
    },
    lat: Number,
    lng: Number,
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);