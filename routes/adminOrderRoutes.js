const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/adminOrderController");

const  protect  = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id", protect, isAdmin, updateOrderStatus);

module.exports = router;
