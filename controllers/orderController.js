const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      paymentMethod,
      address
    } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        message: "Invalid order data"
      });
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      address: {
        address: address.address || address.addressLine || "",
        type: address.type || "HOME"
      }
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("Order create error:", error);
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
};
