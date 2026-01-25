const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");

/* CREATE SUB CATEGORY (Apple, Banana) */
exports.createSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.create({
      ...req.body,
      slug: slugify(req.body.name)
    });

    res.status(201).json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET SUB CATEGORIES BY CATEGORY (Fruits → Apple, Banana) */
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
