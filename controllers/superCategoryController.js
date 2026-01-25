const SuperCategory = require("../models/SuperCategory");
const mongoose = require("mongoose");

/* ================= CREATE ================= */
exports.createSuperCategory = async (req, res) => {
  try {
    const { subCategoryId, images, isDefault } = req.body;

    // Validate subCategoryId
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    // Validate images
    if (!images || images.length !== 3) {
      return res.status(400).json({ message: "Exactly 3 images required" });
    }

    const subCatObjectId = new mongoose.Types.ObjectId(subCategoryId);

    // Ensure only ONE default variant per subcategory
    if (isDefault === true) {
      await SuperCategory.updateMany(
        { subCategoryId: subCatObjectId },
        { $set: { isDefault: false } }
      );
    }

    // Create product with ObjectId
    const product = await SuperCategory.create({
      ...req.body,
      subCategoryId: subCatObjectId
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET BY SUBCATEGORY ================= */
exports.getSuperCategories = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    const data = await SuperCategory.find({
      subCategoryId: new mongoose.Types.ObjectId(subCategoryId),
      isActive: true
    }).sort({ isDefault: -1, kg: 1 });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
exports.getSuperCategoryById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const product = await SuperCategory.findOne({
      _id: new mongoose.Types.ObjectId(productId),
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
