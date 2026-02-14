const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");

/* =========================
   CREATE SUB CATEGORY
========================= */
exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.create({
      ...req.body,
      slug: slugify(req.body.name, { lower: true })
    });

    res.status(201).json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET ALL SUB CATEGORIES BY CATEGORY
========================= */
exports.getSubCategories = async (req, res) => {
  try {
    const data = await SubCategory.find({
      category: req.params.categoryId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   GET SINGLE SUB CATEGORY
========================= */
exports.getSingleSubCategory = async (req, res) => {
  try {
    const data = await SubCategory.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   UPDATE SUB CATEGORY
========================= */
exports.updateSubCategory = async (req, res) => {
  try {
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        slug: slugify(req.body.name, { lower: true })
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* =========================
   DELETE SUB CATEGORY
========================= */
exports.deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};