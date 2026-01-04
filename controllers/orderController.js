const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res) => {
  const { userId, address, paymentMethod } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;
  cart.items.forEach(item => {
    total += item.price * item.quantity;
  });

  const order = await Order.create({
    userId,
    items: cart.items,
    address,
    totalAmount: total,
    paymentMethod
  });

  // Clear cart after order
  cart.items = [];
  await cart.save();

  res.json({
    success: true,
    order
  });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  res.json(await Order.find());
};
