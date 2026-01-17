const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, address } = req.body;

    console.log("ORDER REQUEST BODY 🔥:", req.body);

    // ✅ BASIC VALIDATION
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // ✅ SANITIZE ITEMS (MOST IMPORTANT FIX)
    const cleanItems = items.map((item) => {
      if (!item.productId) {
        throw new Error("productId missing in item");
      }

      return {
        productId: item.productId,
        name: item.name || "",
        price: Number(item.price) || 0,
        kg: item.kg || "",
        quantity: Number(item.quantity) || 1,
        image: item.image || ""
      };
    });

    // ✅ CREATE ORDER
    const order = await Order.create({
      userId, // Mongo user _id (string)
      items: cleanItems,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      address: {
        address: address?.address || "",
        type: address?.type || "HOME"
      },
      status: "Pending"
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    console.error("ORDER CREATE ERROR 🔥🔥🔥", error);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message
    });
  }
};
