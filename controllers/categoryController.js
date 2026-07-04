const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");

const normalizeSlug = (value) => slugify(value || "", { lower: true, strict: true });

exports.createCategory = async (req, res) => {
  try {
    const { images = [], name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (images && images.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images are allowed" });
    }

    const category = await Category.create({
      ...req.body,
      images,
      slug: req.body.slug ? normalizeSlug(req.body.slug) : normalizeSlug(name)
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
      updatedData.slug = req.body.slug ? normalizeSlug(req.body.slug) : normalizeSlug(name);
    } else if (req.body.slug) {
      updatedData.slug = normalizeSlug(req.body.slug);
    }

    if (updatedData.images && updatedData.images.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images are allowed" });
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
  const filters = {};

  if (req.query.includeInactive !== "true") {
    filters.isActive = true;
  }

  if (req.query.mode && ["grocery", "shop-all"].includes(req.query.mode)) {
    filters.shoppingMode = { $in: [req.query.mode, "both", null] };
  }

  const data = await Category.find(filters)
    .sort({ order: 1, createdAt: -1 })
    .lean();

  res.json(data);
};

exports.getNavigationTree = async (req, res) => {
  try {
    const mode = ["grocery", "shop-all"].includes(req.query.mode)
      ? req.query.mode
      : null;

    const categoryFilters = { isActive: true };
    if (mode) {
      categoryFilters.shoppingMode = { $in: [mode, "both", null] };
    }

    const [categories, subCategories] = await Promise.all([
      Category.find(categoryFilters).sort({ order: 1, name: 1 }).lean(),
      SubCategory.find({ isActive: true }).sort({ createdAt: -1 }).lean()
    ]);

    const byId = new Map(
      categories.map((category) => [
        String(category._id),
        {
          ...category,
          type: "category",
          children: []
        }
      ])
    );

    const roots = [];

    byId.forEach((category) => {
      const parentId = category.parent ? String(category.parent) : null;
      if (parentId && byId.has(parentId)) {
        byId.get(parentId).children.push(category);
      } else {
        roots.push(category);
      }
    });

    subCategories.forEach((subCategory) => {
      const parent = byId.get(String(subCategory.category));
      if (!parent) return;

      parent.children.push({
        ...subCategory,
        type: "subcategory",
        parent: subCategory.category,
        children: []
      });
    });

    const sortTree = (items) =>
      items
        .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name))
        .map((item) => ({
          ...item,
          children: sortTree(item.children || [])
        }));

    res.json({
      mode: mode || "all",
      categories: sortTree(roots),
      featured: categories
        .filter((category) => category.featured)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 8),
      popularBrands: [
        ...new Set(categories.flatMap((category) => category.popularBrands || []))
      ].slice(0, 12)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
