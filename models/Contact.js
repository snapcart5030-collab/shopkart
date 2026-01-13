const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // "user" | "admin"
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    messages: [messageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
