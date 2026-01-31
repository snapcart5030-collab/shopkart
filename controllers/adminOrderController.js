const Order = require("../models/Order");
const admin = require("../config/firebaseAdmin");
const {
  sendUserOrderConfirmedMail,
  sendAdminOrderConfirmedMail
} = require("../utils/sendEmail");

// 📦 Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CONFIRM ORDER + SEND EMAILS
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

    // 1️⃣ Update status
    order.status = "CONFIRMED";
    await order.save();

    // 2️⃣ Get USER EMAIL from Firebase Auth
    const userRecord = await admin.auth().getUser(order.userId);
    const userEmail = userRecord.email;

    // 3️⃣ Send EMAILS
    await sendUserOrderConfirmedMail(userEmail, order._id);
    await sendAdminOrderConfirmedMail(order._id);

    res.json({
      success: true,
      message: "Order confirmed & emails sent",
      order
    });

  } catch (err) {
    console.error("Confirm order error:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍✈️ Assign delivery boy
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
