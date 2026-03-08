const router = require("express").Router();

const {
  createProduct,
  getAllProducts,
  getProductsBySubCategory,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getPopularProducts,
  getTrendingProducts,
  getHotProducts
} = require("../controllers/productController");

/* SEARCH */
router.get("/search", searchProducts);

/* SPECIAL ROUTES FIRST */
router.get("/popular", getPopularProducts);
router.get("/trending", getTrendingProducts);
router.get("/hot", getHotProducts);

/* NORMAL ROUTES */
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/sub/:subCategoryId", getProductsBySubCategory);

/* ID ROUTE MUST BE LAST */
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;