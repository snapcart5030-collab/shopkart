const SubCategory = require("../models/SubCategory");

// ➕ CREATE SUB CATEGORY
exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, images, description } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        message: "Name and categoryId are required"
      });
    }

    // ✅ images validation
    if (!images || !Array.isArray(images) || images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required (front, back, left/right)"
      });
    }

    // prevent duplicate subcategory in same category
    const exists = await SubCategory.findOne({ name, categoryId });
    if (exists) {
      return res.status(409).json({
        message: "SubCategory already exists"
      });
    }

    const subCategory = await SubCategory.create({
      name,
      categoryId,
      images,
      description
    });

    res.status(201).json(subCategory);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create sub category",
      error: error.message
    });
  }
};

// 📥 GET SUB CATEGORIES BY CATEGORY ID
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      categoryId: req.params.categoryId
    });

    res.json(subCategories);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sub categories",
      error: error.message
    });
  }
};

// ✏ UPDATE SUB CATEGORY
exports.updateSubCategory = async (req, res) => {
  try {
    if (req.body.images && req.body.images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
      });
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "SubCategory not found"
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

// ❌ DELETE SUB CATEGORY
exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "SubCategory not found"
      });
    }

    res.json({
      success: true,
      message: "SubCategory deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message
    });
  }
};
