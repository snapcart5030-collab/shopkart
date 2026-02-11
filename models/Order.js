const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // firebase uid
      required: true
    },

    userDetails: {
      name: {
        type: String,
        default: ""
      },
      email: {
        type: String,
        default: ""
      },
      mobile: {
        type: String,
        default: ""
      }
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
        "PLACED",
        "CONFIRMED",
        "ASSIGNED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "PLACED"
    },

    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    deliveryBoyLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
