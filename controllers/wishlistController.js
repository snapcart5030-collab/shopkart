const Wishlist = require("../models/Wishlist");

/* ================= ADD ================= */
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, product } = req.body;

    if (!userId || !product?.productId) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const exists = await Wishlist.findOne({
      userId,
      "items.productId": product.productId
    });

    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [product] });
    } else {
      wishlist.items.push(product);
    }

    await wishlist.save();
    res.status(201).json(wishlist);

  } catch (err) {
    console.error("ADD WISHLIST ERROR 🔥", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ================= */
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    res.json(wishlist?.items || []);

  } catch (err) {
    console.error("GET WISHLIST ERROR 🔥", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= REMOVE ================= */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.json([]);
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId !== productId
    );

    await wishlist.save();
    res.json(wishlist.items);

  } catch (err) {
    console.error("REMOVE WISHLIST ERROR 🔥", err);
    res.status(500).json({ message: "Server error" });
  }
};
