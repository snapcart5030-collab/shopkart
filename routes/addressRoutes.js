const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/addressController");

// ➕ Add
router.post("/", addAddress);

// 📥 Get all by user
router.get("/:userId", getAddresses);

// ✏ Update
router.put("/:id", updateAddress);

// ❌ Delete
router.delete("/:id", deleteAddress);

module.exports = router;
