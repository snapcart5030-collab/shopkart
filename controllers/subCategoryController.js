const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");
const slugify = require("slugify");

exports.createSubCategory = async (req, res) => {
  try {
    const { categoryId, name, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    if (!images || images.length !== 3) {
      return res.status(400).json({ message: "3 images required" });
    }

    const sub = await SubCategory.create({
      ...req.body,
      slug: slugify(name)
    });

    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const data = await SubCategory.find({
      categoryId,
      isActive: true
    }).sort({ order: 1, createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
