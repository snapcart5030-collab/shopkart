const router = require("express").Router();
const { createSuperCategory, getSuperCategories } = require("../controllers/superCategoryController");

router.post("/", createSuperCategory);
router.get("/:subCategoryId", getSuperCategories);

module.exports = router;
