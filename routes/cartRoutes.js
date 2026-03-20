const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
  toggleSelectItem,
  removeSelectedItems,
  getUserCart,
  getAllCarts
} = require("../controllers/cartController");


// ➕ ADD TO CART
router.post("/add", addToCart);

// 📥 GET USER CART - FIXED: changed from /user/:userId to /:userId
router.get("/:userId", getCart);

// 🔄 UPDATE QUANTITY - FIXED: changed from /update to /update-quantity
router.put("/update-quantity", updateQuantity);

// ❌ REMOVE ITEM - FIXED: changed from /remove to /remove-item
router.delete("/remove-item", removeItem);

// 🧹 CLEAR CART
router.delete("/clear/:userId", clearCart);

// ☑️ SELECT / UNSELECT
router.put("/select", toggleSelectItem);

// 🧹 REMOVE SELECTED ITEMS
router.put("/remove-selected", removeSelectedItems);

// 📦 ADMIN - GET ALL USERS CART
router.get("/admin/all-carts", getAllCarts);

module.exports = router;