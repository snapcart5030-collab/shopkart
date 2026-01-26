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

    images: {
      type: [String],   // main product images
      default: []
    },

    thumbnails: {
      type: [String],   // 👈 4 thumbnail images
      validate: {
        validator: function (val) {
          return val.length <= 4;
        },
        message: "Only 4 thumbnails allowed"
      },
      default: []
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
