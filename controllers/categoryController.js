const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || images.length !== 3) {
      return res.status(400).json({ message: "3 images required" });
    }
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const data = await Category.find().sort({ createdAt: -1 });
  res.json(data);
};
