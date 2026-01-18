const SavedProduct = require("../models/SavedProduct");

// 🔖 SAVE PRODUCT
exports.saveProduct = async (req, res) => {
  try {
    const { userId, product } = req.body;

    let saved = await SavedProduct.findOne({ userId });

    if (!saved) {
      saved = new SavedProduct({
        userId,
        products: [product]
      });
    } else {
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
    console.error("SAVE PRODUCT ERROR", err);
    res.status(500).json({ message: "Failed to save product" });
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
