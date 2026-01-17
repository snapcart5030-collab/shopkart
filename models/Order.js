const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,   // firebase uid
      required: true
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        kg: String,
        quantity: Number,
        image: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    address: {
      address: String,
      type: String
    },

    status: {
      type: String,
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
