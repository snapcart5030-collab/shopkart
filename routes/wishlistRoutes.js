const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

// ❌ REMOVE extra "wishlist" from paths
router.post("/add", addToWishlist);
router.get("/:userId", getWishlist);
router.delete("/remove", removeFromWishlist);

module.exports = router;
