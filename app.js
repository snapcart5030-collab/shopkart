const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/subcategories", require("./routes/subCategoryRoutes"));
app.use("/api/supercategories", require("./routes/superCategoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/comment", require("./routes/commentRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/saved", require("./routes/savedProductRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));

app.get("/", (req, res) => {
  res.send("ShopKart API Running");
});

module.exports = app;
