const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/addressController");

// ➕ Add address
router.post("/", addAddress);

// 📥 Get all addresses by userId
router.get("/:userId", getAddresses);

// ✏ Update address
router.put("/:id", updateAddress);

// ❌ Delete address
router.delete("/:id", deleteAddress);

module.exports = router;
