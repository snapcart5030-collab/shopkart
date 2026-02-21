const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  reverseGeocode,
  getAddressFromPincode, // NEW
  searchAddresses
} = require("../controllers/addressController");

// All routes are protected (require authentication)
router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);
router.get("/search", protect, searchAddresses);
router.get("/reverse-geocode", protect, reverseGeocode);
router.get("/pincode", protect, getAddressFromPincode); // NEW
router.get("/:id", protect, getAddressById);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;