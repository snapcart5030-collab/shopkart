const Contact = require("../models/Contact");

/* ============================
   USER: SEND MESSAGE
============================ */
exports.sendMessage = async (req, res) => {
  const { message, orderId } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  let chat = await Contact.findOne({ userId: req.user.uid });

  if (!chat) {
    chat = await Contact.create({
      userId: req.user.uid,
      email: req.user.email,
      messages: []
    });
  }

  // USER MESSAGE
  chat.messages.push({
    sender: "user",
    text: message,
    type: orderId ? "order" : "normal",
    orderId: orderId || null
  });

  // 🔥 AUTO SYSTEM FRIENDLY REPLY
  chat.messages.push({
    sender: "system",
    text: "Hi 👋 Thank you for contacting ShopKart Support. Our team will reply shortly. Please relax 😊"
  });

  await chat.save();

  res.json({ success: true });
};

/* ============================
   USER: GET MY CHAT
============================ */
exports.getMyMessages = async (req, res) => {
  const chat = await Contact.findOne({ userId: req.user.uid });
  res.json(chat ? chat.messages : []);
};

/* ============================
   ADMIN: GET ALL CHATS
============================ */
exports.getMessages = async (req, res) => {
  const chats = await Contact.find().sort({ updatedAt: -1 });
  res.json(chats);
};

/* ============================
   ADMIN: REPLY TO USER
============================ */
exports.replyMessage = async (req, res) => {
  const { text, orderId } = req.body;
  const { id } = req.params;

  if (!text) {
    return res.status(400).json({ message: "Reply text required" });
  }

  const chat = await Contact.findById(id);

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  chat.messages.push({
    sender: "admin",
    text,
    type: orderId ? "order" : "normal",
    orderId: orderId || null
  });

  await chat.save();

  res.json({ success: true });
};
