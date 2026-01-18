const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        kg: String,
        image: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
