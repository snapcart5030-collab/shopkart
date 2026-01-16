const Cart = require("../models/Cart");

// 🔢 total calculation
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ➕ ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { userId, email, product } = req.body;

    if (!userId || !email || !product) {
      return res.status(400).json({ message: "Invalid request" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        email,
        items: [product],
        totalPrice: product.price * product.quantity
      });
    } else {
      const index = cart.items.findIndex(
        (i) =>
          i.productId.toString() === product.productId &&
          i.kg === product.kg
      );

      if (index > -1) {
        cart.items[index].quantity += product.quantity;
      } else {
        cart.items.push(product);
      }

      cart.totalPrice = calculateTotal(cart.items);
      await cart.save();
    }

    res.json(cart);

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({
      message: "Add to cart failed",
      error: error.message
    });
  }
};

// 📥 GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔄 UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, kg, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.kg === kg
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ REMOVE ITEM
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId, kg } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) =>
        !(
          i.productId.toString() === productId &&
          i.kg === kg
        )
    );

    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: errori.error });
  }
};

// 🧹 CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
