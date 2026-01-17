const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    name: { type: String, required: true },
    description: String,

    images: {
      type: [String],
      validate: (v) => v.length === 3
    },

    color: String,
    stock: { type: Number, default: 0 },

    isHot: Boolean,
    isTrending: Boolean,
    isTodaySpecial: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
