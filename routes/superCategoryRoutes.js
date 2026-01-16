const express = require("express");
const router = express.Router();

const {
  createSuperCategory,
  getSuperCategories,
  updateSuperCategory,
  deleteSuperCategory
} = require("../controllers/superCategoryController");

// ➕ CREATE
router.post("/", createSuperCategory);

// 📥 GET BY SUB CATEGORY
router.get("/subcategory/:subCategoryId", getSuperCategories);

// ✏ UPDATE
router.put("/:id", updateSuperCategory);

// ❌ DELETE
router.delete("/:id", deleteSuperCategory);

module.exports = router;
