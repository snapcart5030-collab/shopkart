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
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
