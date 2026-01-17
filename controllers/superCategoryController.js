const SuperCategory = require("../models/SuperCategory");
const mongoose = require("mongoose");

exports.createSuperCategory = async (req, res) => {
  const { subCategoryId, kg, images } = req.body;

  if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
    return res.status(400).json({ message: "Invalid subCategoryId" });
  }

  if (!images || images.length !== 3) {
    return res.status(400).json({ message: "3 images required" });
  }

  const exists = await SuperCategory.findOne({ subCategoryId, kg });
  if (exists) {
    return res.status(409).json({ message: "Variant already exists" });
  }

  const product = await SuperCategory.create(req.body);
  res.status(201).json(product);
};

exports.getSuperCategories = async (req, res) => {
  const { subCategoryId } = req.params;

  const data = await SuperCategory.find({ subCategoryId }).sort({ price: 1 });
  res.json(data);
};
