const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/addressController");

// Address routes
router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.patch("/:id/default", protect, setDefaultAddress);

module.exports = router;