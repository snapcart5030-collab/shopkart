const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders
} = require("../controllers/orderController");

router.post("/", placeOrder);
router.get("/user/:userId", getMyOrders);
router.get("/", getAllOrders); // admin

module.exports = router;
