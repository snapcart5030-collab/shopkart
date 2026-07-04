const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true
    },

    shoppingMode: {
      type: String,
      enum: ["grocery", "shop-all", "both"],
      default: "both",
      index: true
    },

    images: {
      type: [String],
      validate: {
        validator: (v) => !v || v.length <= 4,
        message: "Maximum 4 images are allowed"
      }
    },

    icon: String,
    image: String,
    banner: String,
    bgcolor: String,
    description: String,
    featured: {
      type: Boolean,
      default: false,
      index: true
    },

    popularBrands: {
      type: [String],
      default: []
    },

    seo: {
      metaTitle: String,
      metaDescription: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, order: 1 });
categorySchema.index({ shoppingMode: 1, isActive: 1, order: 1 });

module.exports = mongoose.model("Category", categorySchema);
