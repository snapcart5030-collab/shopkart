const express = require("express");
const router = express.Router();

const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory
} = require("../controllers/subCategoryController");

// ➕ CREATE
router.post("/", createSubCategory);

// 📥 GET BY CATEGORY
router.get("/category/:categoryId", getSubCategories);

// ✏ UPDATE
router.put("/:id", updateSubCategory);

// ❌ DELETE
router.delete("/:id", deleteSubCategory);

module.exports = router;
