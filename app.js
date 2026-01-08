const express = require("express");
const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());

// ================== AUTH & USER ==================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// ================== CATEGORY FLOW ==================
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/subcategories", require("./routes/subCategoryRoutes"));
app.use("/api/supercategories", require("./routes/superCategoryRoutes"));

// ================== SLIDER BANNER ==================
app.use("/api/sliders", require("./routes/sliderRoutes"));

// ================== CART & USER DATA ==================
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/saved", require("./routes/savedProductRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));

// ================== COMMENTS & CONTACT ==================
app.use("/api/comment", require("./routes/commentRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// ================== ORDERS & PAYMENTS ==================
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/current-orders", require("./routes/currentOrderRoutes"));

// ================== ADMIN ==================
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("✅ ShopKart API Running Successfully");
});


// ================== 404 HANDLER ==================
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

module.exports = app;
