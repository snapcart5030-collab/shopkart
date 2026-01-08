const mongoose = require("mongoose");

const superCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    // ✅ EXACTLY 3 IMAGES
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length === 3;
        },
        message: "Exactly 3 images are required (front, back, side)"
      }
    },

    kg: {
      type: String, // "500g", "1kg", etc
      default: "500g"
    },

    color: {
      type: String
    },

    stock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperCategory", superCategorySchema);
