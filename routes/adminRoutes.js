const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Register
router.post("/register", adminController.registerAdmin);

// Login
router.post("/login", adminController.loginAdmin);

// Get all admins
router.get("/list", adminController.getAdmins);

// Approve admin
router.put("/approve/:id", adminController.approveAdmin);

// Update admin
router.put("/update/:id", adminController.updateAdmin);

// Delete admin
router.delete("/delete/:id", adminController.deleteAdmin);

module.exports = router;