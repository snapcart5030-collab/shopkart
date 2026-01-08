const CurrentOrder = require("../models/CurrentOrder");

// ➕ CREATE CURRENT ORDER
exports.createCurrentOrder = async (req, res) => {
  try {
    const order = await CurrentOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET ALL CURRENT ORDERS (Admin)
exports.getAllCurrentOrders = async (req, res) => {
  try {
    const orders = await CurrentOrder.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 GET USER CURRENT ORDERS
exports.getUserCurrentOrders = async (req, res) => {
  try {
    const orders = await CurrentOrder.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏ UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await CurrentOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE ORDER (After Delivered)
exports.deleteCurrentOrder = async (req, res) => {
  try {
    await CurrentOrder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
