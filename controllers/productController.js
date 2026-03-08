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


/* ================= SEARCH PRODUCTS ================= */
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Search query required" });
    }

    const products = await Product.find(
      {
        $text: { $search: q },
        isActive: true
      },
      {
        score: { $meta: "textScore" }
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(15)
      .populate("category", "name")
      .populate("subCategory", "name");

    res.json({ products });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPopular: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};exports.getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({ isHot: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
