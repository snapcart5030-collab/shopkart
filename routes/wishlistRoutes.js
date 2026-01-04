const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} = require("../controllers/wishlistController");

// ❤️ Add / like
router.post("/add", addToWishlist);

// 📥 Get wishlist
router.get("/:userId", getWishlist);

// 💔 Remove / unlike
router.delete("/remove", removeFromWishlist);

// 🧹 Clear wishlist
router.delete("/clear/:userId", clearWishlist);

module.exports = router;
