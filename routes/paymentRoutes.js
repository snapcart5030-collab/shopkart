const express = require("express");
const router = express.Router();
const {
  createPayment,
  updatePaymentStatus
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.put("/:id", updatePaymentStatus);

module.exports = router;
