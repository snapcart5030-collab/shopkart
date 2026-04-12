const express = require("express");
const cors = require("cors");
const path = require("path");
const websiteRoutes = require("./routes/websiteRoutes");
const { checkWebsiteStatus } = require("./controllers/websiteController.js");

const app = express();

// ================== MIDDLEWARE ==================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ================== ROUTES THAT ALWAYS WORK (Even when website is OFF) ==================
// Admin panel routes - ALWAYS accessible for admin to turn ON/OFF
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrderRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));        // For admin login
app.use("/api/website", websiteRoutes);                       // Toggle ON/OFF button

// ================== APPLY WEBSITE BLOCKER MIDDLEWARE ==================
// Only user-facing routes below will be blocked when website is OFF
app.use(checkWebsiteStatus);

// ================== USER ROUTES (Blocked when website is OFF) ==================
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/subcategories", require("./routes/subCategoryRoutes"));
app.use("/api/supercategories", require("./routes/superCategoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/sliders", require("./routes/sliderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/saved", require("./routes/savedProductRoutes"));
app.use("/api/address", require("./routes/addressRoutes"));
app.use("/api/comment", require("./routes/commentRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/visitor", require("./routes/visitorRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// ================== STATIC FILES ==================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("✅ ShopKart API Running Successfully");
});

// ================== 404 ==================
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

module.exports = app;