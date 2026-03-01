const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const protect = require("../middlewares/authMiddleware"); // Your protect middleware

// Simple admin check middleware
const isAdmin = (req, res, next) => {
  // You can define your admin emails here or in env
  const adminEmails = (process.env.ADMIN_EMAILS || 'admin@example.com').split(',');
  
  if (adminEmails.includes(req.user.email)) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: "Access denied. Admin only." 
    });
  }
};

// User routes (any authenticated user)
router.post("/", protect, contactController.sendMessage);
router.get("/my", protect, contactController.getMyMessages);

// Admin routes (admin only)
router.get("/admin", protect, isAdmin, contactController.getMessages);
router.get("/admin/:id", protect, isAdmin, contactController.getChatById);
router.post("/admin/:id/reply", protect, isAdmin, contactController.replyMessage);
router.put("/admin/:id/read", protect, isAdmin, contactController.markAsRead);

module.exports = router;