const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  toggleSelectItem
} = require("../controllers/cartController");

// ➕ add
router.post("/add", addToCart);

// 📥 get
router.get("/:userId", getCart);

// 🔄 update qty
router.put("/update", updateQuantity);

// ❌ remove
router.delete("/remove", removeItem);

// 🧹 clear
router.delete("/clear/:userId", clearCart);
router.put("/select", toggleSelectItem);

module.exports = router;
