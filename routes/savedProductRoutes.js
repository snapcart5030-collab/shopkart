const express = require("express");
const router = express.Router();
const {
  saveProduct,
  getSavedProducts,
  unsaveProduct,
  clearSaved
} = require("../controllers/savedProductController");

router.post("/save", saveProduct);
router.get("/:userId", getSavedProducts);
router.delete("/unsave", unsaveProduct);
router.delete("/clear/:userId", clearSaved);

module.exports = router;
