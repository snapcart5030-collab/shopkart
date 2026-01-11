const Cart = require("../models/Cart");

// 🔢 Calculate total
const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

// ➕ ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { userId, product } = req.body;

    // 🔒 VALIDATION (THIS WAS MISSING)
    if (!userId || !product || !product.productId) {
      return res.status(400).json({
        message: "Invalid cart data"
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image
        }],
        totalPrice: product.price * (product.quantity || 1)
      });
    } else {
      const index = cart.items.findIndex(
        i => i.productId.toString() === product.productId
      );

      if (index > -1) {
        cart.items[index].quantity += product.quantity || 1;
      } else {
        cart.items.push({
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.image
        });
      }

      cart.totalPrice = cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );

      await cart.save();
    }

    res.json(cart);

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({
      message: "Add to cart failed"
    });
  }
};


// 📥 GET CART
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [], totalPrice: 0 });
};

// ➕➖ UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();

  res.json(cart);
};

// ❌ REMOVE ITEM
exports.removeItem = async (req, res) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId
  );

  cart.totalPrice = calculateTotal(cart.items);
  await cart.save();

  res.json(cart);
};

// 🧹 CLEAR CART
exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });

  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  res.json({ success: true });
};
