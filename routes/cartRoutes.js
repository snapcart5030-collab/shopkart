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

// 📥 GET USER CART
router.get("/user/:userId", getUserCart);

// 🔄 UPDATE QUANTITY
router.put("/update", updateQuantity);

// ❌ REMOVE ITEM
router.delete("/remove", removeItem);

// 🧹 CLEAR CART
router.delete("/clear/:userId", clearCart);

// ☑️ SELECT / UNSELECT
router.put("/select", toggleSelectItem);

// 🧹 REMOVE SELECTED ITEMS
router.put("/remove-selected", removeSelectedItems);

// 📦 ADMIN - GET ALL USERS CART
router.get("/admin/all-carts", getAllCarts);

module.exports = router;