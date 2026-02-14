const router = require("express").Router();

const {
  createSubCategory,
  getSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory
} = require("../controllers/subCategoryController");

router.post("/", createSubCategory);
router.get("/category/:categoryId", getSubCategories);
router.get("/:id", getSingleSubCategory);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;