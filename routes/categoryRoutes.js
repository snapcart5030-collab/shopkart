const router = require("express").Router();
const {
  createCategory,
  getCategories,
  getNavigationTree,
  getSingleCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.post("/", createCategory);          // Create
router.get("/", getCategories);           // Get All
router.get("/navigation/tree", getNavigationTree); // Header mega menu tree
router.get("/:id", getSingleCategory);    // Get One
router.put("/:id", updateCategory);       // Update
router.delete("/:id", deleteCategory);    // Delete

module.exports = router;
