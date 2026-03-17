const express = require("express");
const router = express.Router();

const {
  saveProduct,
  getSavedProducts,
  unsaveProduct,
  clearSaved,
  getAllSavedProducts
} = require("../controllers/savedProductController");

router.post("/save", saveProduct);

// user saved products
router.get("/user/:userId", getSavedProducts);

// remove saved product
router.delete("/unsave", unsaveProduct);

// clear saved
router.delete("/clear/:userId", clearSaved);

// 👑 admin get all saved products
router.get("/admin/all", getAllSavedProducts);

module.exports = router;