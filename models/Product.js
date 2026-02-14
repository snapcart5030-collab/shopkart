const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      lowercase: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    // 🔥 MAIN IMAGES (Minimum 4 Required)
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 4;
        },
        message: "Minimum 4 product images required"
      }
    },

    // 🔥 THUMBNAILS (Minimum 4 Required)
    thumbnails: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 4;
        },
        message: "Minimum 4 thumbnails required"
      }
    },

    price: {
      type: Number,
      required: true
    },

    description: String,

    stock: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);