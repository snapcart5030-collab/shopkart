const Category = require("../models/Category");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
  try {
    const { images, name } = req.body;

    if (!images || images.length !== 4) {
      return res.status(400).json({ message: "4 images required" });
    }

    const category = await Category.create({
      ...req.body,
      slug: slugify(name)
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedData = {
      ...req.body
    };

    if (name) {
      updatedData.slug = slugify(name);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const data = await Category.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 });

  res.json(data);
};
