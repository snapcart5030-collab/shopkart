const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true
    },

    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1
        },
        image: String
      }
    ],

    totalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Cart", cartSchema);
