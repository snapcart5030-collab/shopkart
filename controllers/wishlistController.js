const Wishlist = require("../models/Wishlist");

// ❤️ ADD / LIKE PRODUCT
exports.addToWishlist = async (req, res) => {
  const { userId, product } = req.body;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      userId,
      items: [product]
    });
  } else {
    const exists = wishlist.items.find(
      (i) => i.productId.toString() === product.productId
    );

    if (!exists) {
      wishlist.items.push(product);
    }
  }

  await wishlist.save();
  res.json(wishlist);
};

// 📥 GET WISHLIST
exports.getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId });
  res.json(wishlist || { items: [] });
};

// 💔 REMOVE / UNLIKE PRODUCT
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return res.status(404).json({ message: "Wishlist not found" });
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await wishlist.save();
  res.json(wishlist);
};

// 🧹 CLEAR WISHLIST
exports.clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.params.userId });

  if (wishlist) {
    wishlist.items = [];
    await wishlist.save();
  }

  res.json({ success: true });
};
