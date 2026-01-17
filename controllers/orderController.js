const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, address } = req.body;

    console.log("ORDER REQUEST BODY 🔥:", req.body);

    /* ================= BASIC VALIDATION ================= */

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

    /* ================= ITEM VALIDATION ================= */

    for (const item of items) {
      if (!item.productId) {
        return res.status(400).json({
          success: false,
          message: "productId missing in order items"
        });
      }
    }

    /* ================= SANITIZE ITEMS ================= */

    const cleanItems = items.map((item) => ({
      productId: String(item.productId),
      name: item.name || "",
      price: Number(item.price) || 0,
      kg: item.kg || "",
      quantity: Number(item.quantity) || 1,
      image: item.image || ""
    }));

    /* ================= CREATE ORDER ================= */

    const order = await Order.create({
      userId: String(userId), // Mongo user _id as string
      items: cleanItems,
      totalAmount: finalTotal,
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
