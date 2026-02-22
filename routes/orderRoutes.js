const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  cancelOrder,
  getAllOrders,
  getOrderById

} = require("../controllers/orderController");

const {
  confirmOrder,
  assignDeliveryBoy
} = require("../controllers/adminOrderController");

const {
  startDelivery,
  updateLocation,
  completeOrder,
} = require("../controllers/deliveryController");

// ➕ CREATE ORDER
router.post("/", createOrder);
router.get("/", getAllOrders);

// 📥 GET ORDERS BY USER
router.get("/user/:userId", getOrdersByUser);

// ❌ CANCEL ORDER
router.put("/cancel/:orderId", cancelOrder);
router.get("/:orderId", getOrderById);
// ✅ ADMIN / DELIVERY FLOW
router.put("/:orderId/confirm", confirmOrder);
router.put("/:orderId/assign", assignDeliveryBoy);
router.put("/:orderId/start", startDelivery);
router.put("/:orderId/location", updateLocation);
router.put("/:orderId/complete", completeOrder);

module.exports = router;
