const Visitor = require("../models/Visitor");

// Add visitor
exports.addVisitor = async (req, res) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await Visitor.create({ ip });

    res.status(200).json({ message: "Visitor counted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total visitors
exports.getVisitors = async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};