const Contact = require("../models/Contact");

// ➕ SEND MESSAGE
exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const newMessage = await Contact.create({ message });

  res.json({
    success: true,
    data: newMessage
  });
};

// 📥 GET ALL MESSAGES (Admin)
exports.getMessages = async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
};

// ❌ DELETE MESSAGE (Admin)
exports.deleteMessage = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
