const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// Register
router.post("/register", adminController.registerAdmin);
router.get("/profile/:id", adminController.getProfileById);  // Fixed: removed space
router.put("/update/:id", adminController.updateAdmin);
router.put("/change-password/:id", adminController.changePassword);
// Login
router.post("/login", adminController.loginAdmin);

// Get all admins
router.get("/list", adminController.getAdmins);

// Approve admin
router.put("/approve/:id", adminController.approveAdmin);

// Delete admin
router.delete("/delete/:id", adminController.deleteAdmin);

module.exports = router;