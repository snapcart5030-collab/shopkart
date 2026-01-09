const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

console.log("TYPE OF protect:", typeof protect); // 🔥 DEBUG LINE

const adminDashboard = (req, res) => {
  res.json({
    message: "Admin dashboard access granted",
    user: req.user,
  });
};

router.get("/dashboard", protect, adminDashboard);

module.exports = router;
