const SubCategory = require("../models/SubCategory");

// ➕ CREATE SUB CATEGORY
exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId, image, description } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        message: "Name and categoryId are required"
      });
    }

    // prevent duplicate
    const exists = await SubCategory.findOne({ name, categoryId });
    if (exists) {
      return res.status(409).json({
        message: "SubCategory already exists"
      });
    }

    const sub = await SubCategory.create({
      name,
      categoryId,
      image,
      description
    });

    res.status(201).json(sub);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create sub category",
      error: error.message
    });
  }
};

// 📥 GET SUB CATEGORIES BY CATEGORY
exports.getSubCategories = async (req, res) => {
  try {
    const subs = await SubCategory.find({
      categoryId: req.params.categoryId
    });

    res.json(subs);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sub categories"
    });
  }
};

// ✏ UPDATE SUB CATEGORY
exports.updateSubCategory = async (req, res) => {
  try {
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
      message: "Update failed"
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
      message: "SubCategory deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
};
