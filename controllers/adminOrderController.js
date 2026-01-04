const Order = require("../models/Order");

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
};

// 🔄 Update order status
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.status },
    { new: true }
  );

  res.json(order);
};
