const mongoose = require("mongoose");

const superCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    // Variant info
    kg: {
      type: Number, // 0.5, 1, 2
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    color: String,

    images: {
      type: [String],
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 images are required"
      }
    },

    isDefault: {
      type: Boolean,
      default: false // 500gm = true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// One variant per kg per subcategory
superCategorySchema.index(
  { subCategoryId: 1, kg: 1 },
  { unique: true }
);

module.exports = mongoose.model("SuperCategory", superCategorySchema);
