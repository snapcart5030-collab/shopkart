const SubCategory = require("../models/SubCategory");

// ➕ CREATE
exports.createSubCategory = async (req, res) => {
  const sub = await SubCategory.create(req.body);
  res.json(sub);
};

// 📥 GET BY CATEGORY
exports.getSubCategories = async (req, res) => {
  const subs = await SubCategory.find({
    categoryId: req.params.categoryId
  });
  res.json(subs);
};

// ✏ UPDATE
exports.updateSubCategory = async (req, res) => {
  const updated = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// ❌ DELETE
exports.deleteSubCategory = async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
