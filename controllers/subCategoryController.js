const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");

exports.createSubCategory = async (req, res) => {
  const { categoryId, name, images } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid categoryId" });
  }

  if (!images || images.length !== 3) {
    return res.status(400).json({ message: "3 images required" });
  }

  const sub = await SubCategory.create(req.body);
  res.status(201).json(sub);
};

exports.getSubCategories = async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res.status(400).json({ message: "Invalid categoryId" });
  }

  const data = await SubCategory.find({ categoryId });
  res.json(data);
};
