const axios = require("axios");

const sendOrderToFormspree = async (orderData) => {
  try {
    const payload = {
      customerName: orderData.customerName || "",
      customerEmail: orderData.customerEmail || "",
      customerMobile: orderData.customerMobile || "",
      address: orderData.address || "",
      paymentMethod: orderData.paymentMethod || "",
      totalAmount: orderData.totalAmount || "",
      orderId: orderData.orderId || "",
      items: Array.isArray(orderData.items)
        ? orderData.items
            .map(
              (item, index) =>
                `${index + 1}. ${item.name} | Qty: ${item.quantity} | Price: ${item.price}`
            )
            .join("\n")
        : "",
      subject: "New Ecommerce Order",
      message: `New order received from ${orderData.customerName || "Customer"}`
    };

    const response = await axios.post(
      process.env.FORMSPREE_ENDPOINT,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Formspree Error:",
      error.response?.data || error.message
    );
    return null;
  }
};

module.exports = sendOrderToFormspree;