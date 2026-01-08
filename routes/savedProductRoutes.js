const express = require("express");
const router = express.Router();
const {
  saveProduct,
  getSavedProducts,
  unsaveProduct,
  clearSaved
} = require("../controllers/savedProductController");

// 🔖 Save
router.post("/save", saveProduct);

// 📥 Get all saved
router.get("/:userId", getSavedProducts);

// ❌ Unsave
router.delete("/unsave", unsaveProduct);

// 🧹 Clear all
router.delete("/clear/:userId", clearSaved);

module.exports = router;
