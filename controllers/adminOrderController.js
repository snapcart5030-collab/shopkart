const Order = require("../models/Order");

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin confirms order
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "PLACED") {
      return res.status(400).json({
        message: "Only placed orders can be confirmed"
      });
    }

    order.status = "CONFIRMED";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍✈️ Admin assigns delivery boy
exports.assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "CONFIRMED") {
      return res.status(400).json({
        message: "Order must be confirmed before assigning delivery boy"
      });
    }

    order.deliveryBoyId = deliveryBoyId;
    order.status = "ASSIGNED";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
