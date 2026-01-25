const Product = require("../models/Product");
const slugify = require("slugify");

/* CREATE PRODUCT */
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      slug: slugify(req.body.name)
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* GET ALL PRODUCTS */
exports.getAllProducts = async (req, res) => {
  const data = await Product.find({ isActive: true })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .sort({ createdAt: -1 });

  res.json(data);
};

/* GET PRODUCTS BY SUBCATEGORY (Apple / Banana) */
exports.getProductsBySubCategory = async (req, res) => {
  const data = await Product.find({
    subCategory: req.params.subCategoryId,
    isActive: true
  }).sort({ createdAt: -1 });

  res.json(data);
};

/* GET SINGLE PRODUCT */
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("subCategory", "name");

  res.json(product);
};

/* UPDATE PRODUCT */
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      slug: slugify(req.body.name)
    },
    { new: true }
  );

  res.json(product);
};

/* DELETE (SOFT DELETE) */
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: "Product deleted successfully" });
};
