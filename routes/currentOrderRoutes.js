const express = require("express");
const router = express.Router();

const {
  createCurrentOrder,
  getAllCurrentOrders,
  getUserCurrentOrders,
  updateOrderStatus,
  deleteCurrentOrder,
} = require("../controllers/currentOrderController");

// User places order
router.post("/", createCurrentOrder);

// User current orders
router.get("/user/:userId", getUserCurrentOrders);

// Admin all current orders
router.get("/", getAllCurrentOrders);

// Update order status
router.put("/:id", updateOrderStatus);

// Delete after delivered
router.delete("/:id", deleteCurrentOrder);

module.exports = router;
