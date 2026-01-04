const Payment = require("../models/Payment");

exports.createPayment = async (req, res) => {
  const { orderId, userId, amount, method } = req.body;

  const payment = await Payment.create({
    orderId,
    userId,
    amount,
    method,
    status: method === "COD" ? "SUCCESS" : "PENDING"
  });

  res.json({
    success: true,
    payment
  });
};

exports.updatePaymentStatus = async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(payment);
};
