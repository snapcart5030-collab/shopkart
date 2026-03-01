const Contact = require("../models/Contact");

/* ============================
   USER: SEND MESSAGE
============================ */
exports.sendMessage = async (req, res) => {
  const { message, orderId } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const userId = req.user.uid;   // ✅ FIXED
    const userEmail = req.user.email;

    let chat = await Contact.findOne({ userId });

    if (!chat) {
      chat = await Contact.create({
        userId,
        email: userEmail,
        messages: []
      });
    }

    chat.messages.push({
      sender: "user",
      text: message,
      type: orderId ? "order" : "normal",
      orderId: orderId || null
    });

    chat.messages.push({
      sender: "system",
      text: "Hi 👋 Thank you for contacting ShopKart Support. Our team will reply shortly. Please relax 😊",
      type: "system"
    });

    await chat.save();

    res.json({
      success: true,
      chat: {
        _id: chat._id,
        messages: chat.messages
      }
    });

  } catch (error) {
    console.error("❌ Error sending message:", error);  // IMPORTANT
    res.status(500).json({ message: "Failed to send message" });
  }
};

/* ============================
   USER: GET MY CHAT
============================ */
exports.getMyMessages = async (req, res) => {
  try {
    // ✅ FIXED: Use req.user.user_id
   const userId = req.user.uid;
    
    const chat = await Contact.findOne({ userId })
      .populate('messages.orderId', 'orderId status total');
    
    if (!chat) {
      // Return empty structure if no chat exists
      return res.json({ 
        messages: [],
        _id: null,
        userId: userId 
      });
    }
    
    res.json(chat);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* ============================
   ADMIN: GET ALL CHATS
============================ */
exports.getMessages = async (req, res) => {
  try {
    const chats = await Contact.find()
      .sort({ updatedAt: -1 })
      .populate('messages.orderId', 'orderId status total');
    
    res.json(chats);
  } catch (error) {
    console.error("Error fetching all chats:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

/* ============================
   ADMIN: GET SINGLE CHAT
============================ */
exports.getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Contact.findById(id)
      .populate('messages.orderId', 'orderId status total');
    
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    
    res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Failed to fetch chat" });
  }
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

  try {
    const chat = await Contact.findById(id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // ADMIN REPLY
    chat.messages.push({
      sender: "admin",
      text,
      type: orderId ? "order" : "normal",
      orderId: orderId || null
    });

    await chat.save();

    res.json({ 
      success: true,
      message: "Reply sent successfully",
      chat: {
        _id: chat._id,
        messages: chat.messages
      }
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};

/* ============================
   ADMIN: MARK MESSAGES AS READ
============================ */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { messageIds } = req.body;

    const chat = await Contact.findById(id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Mark messages as read
    if (messageIds && messageIds.length > 0) {
      chat.messages.forEach(msg => {
        if (messageIds.includes(msg._id.toString())) {
          msg.read = true;
        }
      });
      await chat.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};