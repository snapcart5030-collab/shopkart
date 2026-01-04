const mongoose = require("mongoose");

const superCategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true
    },

    name: { type: String, required: true },
    description: String,
    price: Number,
    image: String,
    kg: String,
    color: String,
    stock: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("SuperCategory", superCategorySchema);
