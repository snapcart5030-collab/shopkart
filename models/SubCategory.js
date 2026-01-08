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

    description: {
      type: String
    },

    // ✅ exactly 3 images (front, back, left/right)
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 3;
        },
        message: "Exactly 3 images are required"
      },
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
