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

    description: String,

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 images are required"
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
