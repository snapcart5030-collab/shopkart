const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
