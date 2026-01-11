const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    uid: {
      type: String, // Firebase UID
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["HOME", "OFFICE", "DELIVERY", "OTHER"],
      default: "HOME"
    },

    address: {
      type: String,
      required: true,
      trim: true
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
