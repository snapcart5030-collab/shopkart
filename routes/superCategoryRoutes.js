const router = require("express").Router();
const {
  createSuperCategory,
  getSuperCategories,
  getSuperCategoryById
} = require("../controllers/superCategoryController");

// create
router.post("/", createSuperCategory);

// 🔥 SINGLE PRODUCT (KEEP THIS FIRST)
router.get("/product/:productId", getSuperCategoryById);

// list by subcategory
router.get("/:subCategoryId", getSuperCategories);

module.exports = router;
