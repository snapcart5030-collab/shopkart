const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser,
  cancelOrder
} = require("../controllers/orderController");

// ➕ CREATE ORDER
router.post("/", createOrder);

// 📥 GET ORDERS BY USER
router.get("/user/:userId", getOrdersByUser);

// ❌ CANCEL ORDER
router.put("/cancel/:orderId", cancelOrder);

module.exports = router;
