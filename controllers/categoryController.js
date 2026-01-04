const Category = require("../models/Category");

// ➕ CREATE
exports.createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.json(category);
};

// 📥 GET ALL
exports.getCategories = async (req, res) => {
  res.json(await Category.find());
};

// ✏ UPDATE
exports.updateCategory = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// ❌ DELETE
exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
