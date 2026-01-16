const SuperCategory = require("../models/SuperCategory");
const mongoose = require("mongoose");

// ➕ CREATE SUPER CATEGORY (PRODUCT / VARIANT)
exports.createSuperCategory = async (req, res) => {
  try {
    const {
      name,
      subCategoryId,
      price,
      images,
      description,
      kg,
      color,
      stock
    } = req.body;

    if (!name || !subCategoryId || !price || !kg) {
      return res.status(400).json({
        message: "Name, subCategoryId, price and kg are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    if (!images || !Array.isArray(images) || images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
      });
    }

    const exists = await SuperCategory.findOne({ subCategoryId, kg });
    if (exists) {
      return res.status(409).json({
        message: "This kg variant already exists"
      });
    }

    const product = await SuperCategory.create({
      name,
      subCategoryId,
      price,
      images,
      description,
      kg,
      color,
      stock
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create super category",
      error: error.message
    });
  }
};

// 📥 GET BY SUB CATEGORY
exports.getSuperCategories = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid subCategoryId" });
    }

    const products = await SuperCategory
      .find({ subCategoryId })
      .sort({ price: 1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch super categories",
      error: error.message
    });
  }
};

// ✏ UPDATE
exports.updateSuperCategory = async (req, res) => {
  try {
    if (req.body.images && req.body.images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
      });
    }

    const updated = await SuperCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "SuperCategory not found"
      });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message
    });
  }
};

// ❌ DELETE
exports.deleteSuperCategory = async (req, res) => {
  try {
    const deleted = await SuperCategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "SuperCategory not found"
      });
    }

    res.json({
      success: true,
      message: "SuperCategory deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};
