const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByUser
} = require("../controllers/orderController");

// ➕ CREATE ORDER
router.post("/", createOrder);

// 📥 GET ORDERS BY USER
router.get("/user/:userId", getOrdersByUser);

module.exports = router;
