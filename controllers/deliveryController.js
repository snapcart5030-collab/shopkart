const Order = require("../models/Order");
const { io } = require("../server");

// 🚴 Delivery boy starts delivery
exports.startDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "ASSIGNED") {
      return res.status(400).json({
        message: "Order must be assigned before starting delivery"
      });
    }

    order.status = "OUT_FOR_DELIVERY";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📍 Update live location


// 📍 Update live location (DB + SOCKET)
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const { orderId } = req.params;

    if (!lat || !lng) {
      return res.status(400).json({
        message: "Latitude and longitude required"
      });
    }

    // 1️⃣ Save to DB
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoyLocation: {
          lat,
          lng,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Emit via Socket
    io.to(`order_${orderId}`).emit("locationUpdate", {
      lat,
      lng,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: "Location updated",
      location: order.deliveryBoyLocation
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Complete order
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "OUT_FOR_DELIVERY") {
      return res.status(400).json({
        message: "Order must be out for delivery to complete"
      });
    }

    order.status = "DELIVERED";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
