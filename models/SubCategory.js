const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      lowercase: true
    },

    description: String,

    images: {
      type: [String],
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 images are required"
      }
    },

    color: String,

    isHot: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isTodaySpecial: { type: Boolean, default: false },

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

module.exports = mongoose.model("SubCategory", subCategorySchema);
