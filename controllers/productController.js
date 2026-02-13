const Product = require("../models/Product");
const slugify = require("slugify");
const mongoose = require("mongoose");

/* ================= CREATE PRODUCT ================= */
exports.createProduct = async (req, res) => {
  try {
    const { name, category, subCategory } = req.body;

    // 🔒 Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({ error: "Invalid subCategory ID" });
    }

    const product = await Product.create({
      ...req.body,
      slug: slugify(name, { lower: true })
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL PRODUCTS ================= */
exports.getAllProducts = async (req, res) => {
  try {
    const data = await Product.find({ isActive: true })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET PRODUCTS BY SUBCATEGORY ================= */
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ error: "Invalid subCategory ID" });
    }

    const data = await Product.find({
      subCategory: subCategoryId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET SINGLE PRODUCT ================= */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (req.body.category && !mongoose.Types.ObjectId.isValid(req.body.category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    if (req.body.subCategory && !mongoose.Types.ObjectId.isValid(req.body.subCategory)) {
      return res.status(400).json({ error: "Invalid subCategory ID" });
    }

    const updateData = {
      ...req.body
    };

    if (req.body.name) {
      updateData.slug = slugify(req.body.name, { lower: true });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE PRODUCT (SOFT DELETE) ================= */
/* ================= DELETE PRODUCT (SOFT DELETE) ================= */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
