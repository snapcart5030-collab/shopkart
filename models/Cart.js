const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // ✅ Firebase UID (STRING)
    userId: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        name: String,
        price: Number,
        kg: String,
        quantity: {
          type: Number,
          default: 1,
          min: 1
        },
        image: String,

        // ✅ NEW
        isSelected: {
          type: Boolean,
          default: false
        }
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
