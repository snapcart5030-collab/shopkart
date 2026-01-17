const mongoose = require("mongoose");

const superCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    name: String,
    price: { type: Number, required: true },
    kg: { type: String, required: true },
    stock: { type: Number, default: 0 },
    color: String,

    images: {
      type: [String],
      validate: (v) => v.length === 3
    }
  },
  { timestamps: true }
);

superCategorySchema.index(
  { subCategoryId: 1, kg: 1 },
  { unique: true }
);

module.exports = mongoose.model("SuperCategory", superCategorySchema);
