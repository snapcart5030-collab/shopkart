const SuperCategory = require("../models/SuperCategory");
const mongoose = require("mongoose");

exports.createSuperCategory = async (req, res) => {
  try {
    const { subCategoryId, kg, images, isDefault } = req.body;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    if (!images || images.length !== 3) {
      return res.status(400).json({ message: "3 images required" });
    }

    if (isDefault) {
      // ensure only ONE default variant (500gm)
      await SuperCategory.updateMany(
        { subCategoryId },
        { isDefault: false }
      );
    }

    const product = await SuperCategory.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuperCategories = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const data = await SuperCategory.find({
      subCategoryId,
      isActive: true
    }).sort({ kg: 1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getSuperCategoryById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const product = await SuperCategory.findOne({
      _id: productId,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
