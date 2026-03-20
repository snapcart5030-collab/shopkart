import axios from "axios";

const FORMSPREE_URL = "https://formspree.io/f/xyknvddy";

export const sendOrderToFormspree = async (orderData) => {
  try {
    const response = await axios.post(FORMSPREE_URL, {
      name: orderData.name,
      email: orderData.email,
      mobile: orderData.mobile,
      address: orderData.address,
      items: JSON.stringify(orderData.items, null, 2),
      totalAmount: orderData.totalAmount
    });

    return response.data;
  } catch (error) {
    console.error("Formspree Error:", error);
    throw error;
  }
};