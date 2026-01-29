const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  confirmOrder,
  assignDeliveryBoy
} = require("../controllers/adminOrderController");

const protect = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

// 📥 ADMIN: GET ALL ORDERS
router.get("/", protect, isAdmin, getAllOrders);

// ✅ ADMIN: CONFIRM ORDER
router.put("/:orderId/confirm", protect, isAdmin, confirmOrder);

// 🧑‍✈️ ADMIN: ASSIGN DELIVERY BOY
router.put("/:orderId/assign", protect, isAdmin, assignDeliveryBoy);

module.exports = router;
