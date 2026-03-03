const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  getProfile,
  getAllUsers,
  updateProfile
} = require("../controllers/userController");


// ================= GET PROFILE =================
router.get("/profile", protect, getProfile);


// ================= GET ALL USERS =getAllUsers================
router.get("/all", getAllUsers);
// 🔒 protect added (important)


// ================= UPDATE PROFILE =================
router.put(
  "/profile",
  protect,
  upload.single("photo"),
  updateProfile
);

module.exports = router;