const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

/* CRUD ROUTES */
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/sub/:subCategoryId", getProductsBySubCategory);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
