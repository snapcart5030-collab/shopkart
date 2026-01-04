const mongoose = require("mongoose");

const savedProductSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },

    products: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        image: String,
        savedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedProduct", savedProductSchema);
