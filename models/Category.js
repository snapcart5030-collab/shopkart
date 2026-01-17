const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    images: {
      type: [String],
      validate: {
        validator: (v) => v.length === 3,
        message: "Exactly 3 images are required"
      }
    },

    icon: String,
    bgcolor: String,
    description: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
