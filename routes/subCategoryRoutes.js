const router = require("express").Router();
const { createSubCategory, getSubCategories } = require("../controllers/subCategoryController");

router.post("/", createSubCategory);
router.get("/:categoryId", getSubCategories);

module.exports = router;
