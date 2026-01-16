const Category = require("../models/Category");

// ➕ CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
      });
    }

    const category = await Category.create(req.body);
    res.status(201).json(category);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { images } = req.body;

    if (images && images.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 images are required"
      });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
