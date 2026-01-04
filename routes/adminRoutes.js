const express = require("express");
const router = express.Router();
const {
  dashboard,
  getUsers,
  changeRole,
  deleteUser
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

// 📊 Dashboard
router.get("/dashboard", protect, isAdmin, dashboard);

// 👥 Users
router.get("/users", protect, isAdmin, getUsers);
router.put("/user/:id/role", protect, isAdmin, changeRole);
router.delete("/user/:id", protect, isAdmin, deleteUser);

module.exports = router;
