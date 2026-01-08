const SavedProduct = require("../models/SavedProduct");

// 🔖 SAVE PRODUCT
exports.saveProduct = async (req, res) => {
  const { userId, product } = req.body;

  let saved = await SavedProduct.findOne({ userId });

  if (!saved) {
    saved = await SavedProduct.create({
      userId,
      products: [product]
    });
  } else {
    const exists = saved.products.find(
      (p) => p.productId.toString() === product.productId
    );

    if (!exists) {
      saved.products.push(product);
    }
  }

  await saved.save();
  res.json(saved);
};

// 📥 GET SAVED PRODUCTS
exports.getSavedProducts = async (req, res) => {
  const saved = await SavedProduct.findOne({ userId: req.params.userId });
  res.json(saved || { products: [] });
};

// ❌ UNSAVE PRODUCT
exports.unsaveProduct = async (req, res) => {
  const { userId, productId } = req.body;

  const saved = await SavedProduct.findOne({ userId });
  if (!saved) {
    return res.status(404).json({ message: "No saved products" });
  }

  saved.products = saved.products.filter(
    (p) => p.productId.toString() !== productId
  );

  await saved.save();
  res.json(saved);
};

// 🧹 CLEAR ALL SAVED
exports.clearSaved = async (req, res) => {
  const saved = await SavedProduct.findOne({ userId: req.params.userId });

  if (saved) {
    saved.products = [];
    await saved.save();
  }

  res.json({ success: true });
};
