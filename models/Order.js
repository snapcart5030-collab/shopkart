const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // firebase uid
      required: true
    },

    items: [
      {
        productId: {
          type: String,
          required: true
        },
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
      address: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "HOME"
      }
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
