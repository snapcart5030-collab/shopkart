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

    const searchRegex = new RegExp(q, 'i');

    // Search in Categories
    const categories = await Category.find({
      name: searchRegex,
      isActive: true
    }).select('name images slug');

    // Search in SubCategories
    const subcategories = await SubCategory.find({
      name: searchRegex,
      isActive: true
    }).select('name images categoryId')
      .populate('categoryId', 'name');

    // Get all products from matching categories and subcategories
    let categoryIds = categories.map(c => c._id);
    let subcategoryIds = subcategories.map(s => s._id);

    // Also search products directly by name
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { categoryId: { $in: categoryIds } },
        { subCategoryId: { $in: subcategoryIds } }
      ],
      isActive: true
    }).select('name price images categoryId subCategoryId')
      .populate('categoryId', 'name')
      .populate('subCategoryId', 'name')
      .limit(50);

    // Get super categories (variants) for matching products
    const productIds = products.map(p => p._id);
    const superCategories = await SuperCategory.find({
      productId: { $in: productIds },
      isActive: true
    }).select('kg price stock productId isDefault');

    // Organize response
    res.json({
      categories,
      subcategories,
      products: products.map(product => ({
        ...product.toObject(),
        variants: superCategories.filter(sc => 
          sc.productId.toString() === product._id.toString()
        )
      }))
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
};