const express = require("express");
const router = express.Router();
const {
  createSuperCategory,
  getSuperCategories,
  updateSuperCategory,
  deleteSuperCategory
} = require("../controllers/superCategoryController");

router.post("/", createSuperCategory);
router.get("/:subCategoryId", getSuperCategories);
router.put("/:id", updateSuperCategory);
router.delete("/:id", deleteSuperCategory);

module.exports = router;
