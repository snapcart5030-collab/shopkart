const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart
} = require("../controllers/cartController");

// ➕ add
router.post("/add", addToCart);

// 🔄 update qty
router.put("/update", updateQuantity);

// ❌ remove
router.delete("/remove", removeItem);

// 🧹 clear
router.delete("/clear/:userId", clearCart);

// 📥 get (⚠️ LAST)
router.get("/:userId", getCart);

module.exports = router;
