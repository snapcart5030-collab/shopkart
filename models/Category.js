const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    images: {
      type: [String], 
      validate: [arrayLimit, "Only 3 images allowed"]
    },
    


    icon: String,
    bgcolor: String,
    description: String
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length === 3;
}

module.exports = mongoose.model("Category", categorySchema);
