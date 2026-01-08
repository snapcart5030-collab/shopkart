const express = require("express");
const router = express.Router();

const {
  addSlider,
  getSliders,
  updateSlider,
  deleteSlider
} = require("../controllers/sliderController");

// ➕ Add slider
router.post("/", addSlider);

// 📥 Get all sliders
router.get("/", getSliders);

// ✏ Update slider
router.put("/:id", updateSlider);

// ❌ Delete slider
router.delete("/:id", deleteSlider);

module.exports = router;
