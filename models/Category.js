const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true
    },

    images: {
      type: [String],
      validate: {
        validator: (v) => v.length === 4,
        message: "Exactly 4 images are required"
      }
    },

    icon: String,
    bgcolor: String,
    description: String,

    isActive: {
      type: Boolean,
      default: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
