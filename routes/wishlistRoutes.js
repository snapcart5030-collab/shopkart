const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

router.post("/wishlist/add", addToWishlist);
router.get("/wishlist/:userId", getWishlist);
router.delete("/wishlist/remove", removeFromWishlist);

module.exports = router;
