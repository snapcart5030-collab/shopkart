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

    description: String,

    price: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 images are required"
      }
    },

    kg: {
      type: String, // 500g, 1kg, 2kg
      required: true
    },

    color: String,

    stock: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// 🔒 Prevent duplicate variant (same subCategory + kg)
superCategorySchema.index(
  { subCategoryId: 1, kg: 1 },
  { unique: true }
);

module.exports = mongoose.model("SuperCategory", superCategorySchema);
