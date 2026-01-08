const SuperCategory = require("../models/SuperCategory");

// ➕ CREATE SUPER CATEGORY (PRODUCT)
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

    if (!name || !subCategoryId || !price) {
      return res.status(400).json({
        message: "Name, subCategoryId and price are required"
      });
    }

    // ✅ image validation
    if (!images || !Array.isArray(images) || images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
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
    const products = await SuperCategory.find({
      subCategoryId: req.params.subCategoryId
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch super categories",
      error: error.message
    });
  }
};

// ✏ UPDATE SUPER CATEGORY
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
      { new: true }
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

// ❌ DELETE SUPER CATEGORY
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
