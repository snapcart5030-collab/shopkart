const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const SuperCategory = require("../models/SuperCategory");

exports.searchAll = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({
        categories: [],
        subcategories: [],
        products: []
      });
    }

    const regex = new RegExp(q, "i");

    const categories = await Category.find({
      name: regex,
      isActive: true
    }).select("name images slug");

    const subcategories = await SubCategory.find({
      name: regex,
      isActive: true
    })
      .select('name images category')
      .populate('category', 'name')

    const categoryIds = categories.map(c => c._id);
    const subcategoryIds = subcategories.map(s => s._id);

    const products = await Product.find({
      $or: [
        { name: regex },
        { categoryId: { $in: categoryIds } },
        { subCategoryId: { $in: subcategoryIds } }
      ],
      isActive: true
    })
      .select("name price images categoryId subCategoryId")
      .limit(50);

    res.json({
      categories,
      subcategories,
      products
    });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
};