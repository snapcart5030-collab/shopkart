const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // firebase uid
      required: true
    },
     email: {
      type: String,
      default: ""
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

    // 🔥 DELIVERY READY STATUS
    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "ASSIGNED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PLACED"
    },

    // 🧑‍✈️ DELIVERY BOY
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // 📍 LIVE LOCATION
    deliveryBoyLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
