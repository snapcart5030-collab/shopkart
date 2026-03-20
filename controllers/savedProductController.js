const SavedProduct = require("../models/SavedProduct");



// 👑 ADMIN - GET ALL SAVED PRODUCTS

exports.getAllSavedProducts = async (req, res) => {
  try {

    const savedProducts = await SavedProduct.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: savedProducts.length,
      savedProducts
    });

  } catch (error) {

    console.error("ADMIN SAVED PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch saved products"
    });

  }
};
// 🔖 SAVE PRODUCT
exports.saveProduct = async (req, res) => {
  try {
    const { userId, email, product } = req.body;

    if (!userId || !email || !product?.productId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let saved = await SavedProduct.findOne({ userId });

    if (!saved) {
      saved = new SavedProduct({
        userId,
        email,
        products: [product]
      });
    } else {
      saved.email = email;

      const exists = saved.products.find(
        (p) => p.productId === product.productId
      );

      if (!exists) {
        saved.products.push(product);
      }
    }

    await saved.save();
    res.json(saved.products);

  } catch (err) {
    console.error("SAVE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Failed to save product",
      error: err.message
    });
  }
};

// 📥 GET SAVED PRODUCTS
exports.getSavedProducts = async (req, res) => {
  try {
    const saved = await SavedProduct.findOne({ userId: req.params.userId });
    res.json(saved?.products || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to load saved products" });
  }
};

// ❌ UNSAVE PRODUCT
exports.unsaveProduct = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const saved = await SavedProduct.findOne({ userId });
    if (!saved) return res.json([]);

    saved.products = saved.products.filter(
      (p) => p.productId !== productId
    );

    await saved.save();
    res.json(saved.products);

  } catch (err) {
    res.status(500).json({ message: "Failed to unsave product" });
  }
};

// 🧹 CLEAR ALL SAVED
exports.clearSaved = async (req, res) => {
  try {
    const saved = await SavedProduct.findOne({ userId: req.params.userId });
    if (saved) {
      saved.products = [];
      await saved.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear saved products" });
  }
};
