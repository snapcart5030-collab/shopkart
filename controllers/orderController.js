const Order = require("../models/Order");

/* =========================
   CREATE ORDER
========================= */
exports.createOrder = async (req, res) => {
  try {
   const { userId, userDetails, items, totalAmount, paymentMethod, address } = req.body;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    const finalTotal = Number(totalAmount);
    if (isNaN(finalTotal) || finalTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount"
      });
    }

    const cleanItems = items.map((item) => ({
      productId: String(item.productId),
      name: item.name || "",
      price: Number(item.price) || 0,
      kg: item.kg || "",
      quantity: Number(item.quantity) || 1,
      image: item.image || ""
    }));

   const order = await Order.create({
  userId: String(userId),

  userDetails: {
    name: userDetails?.name || "",
    email: userDetails?.email || "",   // ✅ FIXED
    mobile: userDetails?.mobile || ""
  },

  items: cleanItems,
  totalAmount: finalTotal,
  paymentMethod: paymentMethod || "COD",
  address: {
    address: address?.address || "",
    type: address?.type || "HOME"
  },
  status: "PLACED"
});


    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message
    });
  }
};

/* =========================
   GET ORDERS BY USER
========================= */
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order
      .find({ userId: String(userId) })
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders"
    });
  }
};
/* =========================
   CANCEL ORDER
========================= */
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (
      order.status === "DELIVERED" ||
      order.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled"
      });
    }

    order.status = "CANCELLED";
    await order.save();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cancel order failed",
      error: error.message
    });
  }
};
