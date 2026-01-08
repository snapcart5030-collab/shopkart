const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    method: String, // COD / ONLINE
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
