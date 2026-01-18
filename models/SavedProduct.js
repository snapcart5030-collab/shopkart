const mongoose = require("mongoose");

const savedProductSchema = new mongoose.Schema(
  {
    userId: {
      type: String,          // ✅ FIX: String (Firebase UID)
      required: true,
      unique: true
    },

    products: [
      {
        productId: String,   // ✅ String (same as wishlist/cart)
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
