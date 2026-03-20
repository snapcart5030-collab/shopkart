const Cart = require("../models/Cart");

// 🔢 total calculation
const calculateTotal = (items) =>
  items
    .filter(item => item.isSelected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

// ➕ ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { userId, email, product } = req.body;

    if (!userId || !email || !product) {
      return res.status(400).json({ message: "Invalid request" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // NEW CART - set isSelected to true by default
      product.isSelected = true;

      cart = await Cart.create({
        userId,
        email,
        items: [product],
        totalPrice: 0
      });

    } else {
      const index = cart.items.findIndex(
        (i) =>
          i.productId.toString() === product.productId &&
          i.kg === product.kg
      );

      if (index > -1) {
        // EXISTING ITEM - increment quantity, keep existing selection state
        cart.items[index].quantity += product.quantity;
        // Don't change the isSelected value - keep what was there
      } else {
        // NEW ITEM IN EXISTING CART - set isSelected to true by default
        product.isSelected = true;
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
// 📥 GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      // Return 404 so frontend knows cart doesn't exist
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 📦 ADMIN - GET ALL USERS CART
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: carts.length,
      carts
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch carts",
      error: error.message
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ☑️ SELECT / UNSELECT ITEM
exports.toggleSelectItem = async (req, res) => {
  try {
    const { userId, productId, kg, isSelected } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) =>
        i.productId.toString() === productId &&
        i.kg === kg
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.isSelected = isSelected;

    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSelectedItems = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => !item.isSelected);
    cart.totalPrice = 0;

    await cart.save();

    res.json(cart);

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
    res.status(500).json({ message: error.message });
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