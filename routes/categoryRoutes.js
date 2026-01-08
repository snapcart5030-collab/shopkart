const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

router.post("/", createCategory);     // CREATE
router.get("/", getCategories);       // READ
router.put("/:id", updateCategory);   // UPDATE
router.delete("/:id", deleteCategory);// DELETE

module.exports = router;
