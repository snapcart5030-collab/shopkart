const Slider = require("../models/Slider");

// ➕ ADD SLIDER
exports.addSlider = async (req, res) => {
  try {
    const { title, image, link, isActive } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const slider = await Slider.create({
      title,
      image,
      link,
      isActive
    });

    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 GET ALL SLIDERS
exports.getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏ UPDATE SLIDER
exports.updateSlider = async (req, res) => {
  try {
    const updated = await Slider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE SLIDER
exports.deleteSlider = async (req, res) => {
  try {
    const deleted = await Slider.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
