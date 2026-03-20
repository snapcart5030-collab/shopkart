const Order = require("../models/Order");
const axios = require("axios");
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const now = new Date();

    if (
      order.deliveryDate &&
      order.status !== "CANCELLED" &&
      order.status !== "DELIVERED"
    ) {
      const totalTime = order.deliveryDate - order.createdAt;
      const elapsed = now - order.createdAt;

      const progress = Math.min((elapsed / totalTime) * 100, 100);

      if (progress >= 100) order.status = "DELIVERED";
      else if (progress >= 75) order.status = "OUT_FOR_DELIVERY";
      else if (progress >= 50) order.status = "ASSIGNED";
      else if (progress >= 25) order.status = "CONFIRMED";
      else order.status = "PLACED";
    }

    return res.json(order);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch order"
    });
  }
};
/* =========================


   CREATE ORDER
========================= */
// exports.createOrder = async (req, res) => {
  
//   try {
//    const { userId, userDetails, items, totalAmount, paymentMethod, address } = req.body;


//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "userId is required"
//       });
//     }

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order items are required"
//       });
//     }

//     const finalTotal = Number(totalAmount);
//     if (isNaN(finalTotal) || finalTotal <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid total amount"
//       });
//     }

//     const cleanItems = items.map((item) => ({
//       productId: String(item.productId),
//       name: item.name || "",
//       price: Number(item.price) || 0,
//       kg: item.kg || "",
//       quantity: Number(item.quantity) || 1,
//       image: item.image || ""
//     }));

// const deliveryDate = new Date();
// deliveryDate.setDate(deliveryDate.getDate() + 2);

// const order = await Order.create({
//   userId: String(userId),

//   userDetails: {
//     name: userDetails?.name || "",
//     email: userDetails?.email || "",
//     mobile: userDetails?.mobile || ""
//   },

//   items: cleanItems,
//   totalAmount: finalTotal,
//   paymentMethod: paymentMethod || "COD",
//   address: {
//     address: address?.address || "",
//     type: address?.type || "HOME"
//   },
//   status: "PLACED",
//   deliveryDate
// });


//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Order creation failed",
//       error: error.message
//     });
//   }
// };





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

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);

    const order = await Order.create({
      userId: String(userId),
      userDetails: {
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        mobile: userDetails?.mobile || ""
      },
      items: cleanItems,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod || "COD",
      address: {
        address: address?.address || "",
        type: address?.type || "HOME"
      },
      status: "PLACED",
      deliveryDate
    });

    try {
      await axios.post(
        process.env.FORMSPREE_ENDPOINT,
        {
          customerName: order.userDetails.name,
          customerEmail: order.userDetails.email,
          customerMobile: order.userDetails.mobile,
          address: order.address.address,
          addressType: order.address.type,
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          orderId: order._id,
          items: order.items
            .map(
              (item, index) =>
                `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ${item.price} | Kg: ${item.kg}`
            )
            .join("\n"),
          message: "New order placed successfully"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );
    } catch (formError) {
      console.error("Formspree Error:", formError.response?.data || formError.message);
    }

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

    const now = new Date();

    orders.forEach(order => {

      if (!order.deliveryDate) return;

      if (order.status === "CANCELLED" || order.status === "DELIVERED") return;

      const totalTime = order.deliveryDate - order.createdAt;
      const elapsed = now - order.createdAt;

      const progress = Math.min((elapsed / totalTime) * 100, 100);

      if (progress >= 100) order.status = "DELIVERED";
      else if (progress >= 75) order.status = "OUT_FOR_DELIVERY";
      else if (progress >= 50) order.status = "ASSIGNED";
      else if (progress >= 25) order.status = "CONFIRMED";
      else order.status = "PLACED";

    });

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
