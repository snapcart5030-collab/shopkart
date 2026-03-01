const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // "user" | "admin" | "system"
      required: true
    },
    text: {
      type: String,
      required: true
    },
    type: {
      type: String, // "normal" | "order"
      default: "normal"
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    }
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);