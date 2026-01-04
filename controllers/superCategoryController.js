const SuperCategory = require("../models/SuperCategory");

// ➕ CREATE PRODUCT
exports.createSuperCategory = async (req, res) => {
  const product = await SuperCategory.create(req.body);
  res.json(product);
};

// 📥 GET BY SUBCATEGORY
exports.getSuperCategories = async (req, res) => {
  const products = await SuperCategory.find({
    subCategoryId: req.params.subCategoryId
  });
  res.json(products);
};

// ✏ UPDATE
exports.updateSuperCategory = async (req, res) => {
  const updated = await SuperCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// ❌ DELETE
exports.deleteSuperCategory = async (req, res) => {
  await SuperCategory.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
