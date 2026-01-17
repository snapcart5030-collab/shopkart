const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, address } = req.body;

    console.log("ORDER REQUEST BODY:", req.body); // 🔥 MUST

    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        message: "Invalid order data"
      });
    }

    // 🔒 sanitize items (VERY IMPORTANT)
    const cleanItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      kg: item.kg,
      quantity: Number(item.quantity),
      image: item.image
    }));

    const order = await Order.create({
      userId,
      items: cleanItems,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || "COD",
      address: {
        address: address?.address || "",
        type: address?.type || "HOME"
      }
    });

    res.status(201).json(order);

  } catch (error) {
    console.error("ORDER CREATE ERROR 🔥🔥🔥", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
};
