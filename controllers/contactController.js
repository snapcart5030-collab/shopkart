const Contact = require("../models/Contact");
const mongoose = require("mongoose");

/* ============================
   USER: SEND MESSAGE
============================ */
exports.sendMessage = async (req, res) => {
  const { message, orderId } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    // Get user ID - Firebase can have it in different places
    const userId = req.user.uid || req.user.user_id || req.user.sub;
    const userEmail = req.user.email;

    console.log("Sending message for user:", userId, userEmail);

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID not found in token",
        user: req.user 
      });
    }

    let chat = await Contact.findOne({ userId });

    if (!chat) {
      chat = new Contact({
        userId,
        email: userEmail,
        messages: []
      });
    }

    // Validate orderId if provided
    let validOrderId = null;
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      validOrderId = orderId;
    }

    // Add user message
    chat.messages.push({
      sender: "user",
      text: message,
      type: validOrderId ? "order" : "normal",
      orderId: validOrderId,
      read: false
    });

    // Add system message
    chat.messages.push({
      sender: "system",
      text: "Hi 👋 Thank you for contacting ShopKart Support. Our team will reply shortly. Please relax 😊",
      type: "system",
      orderId: null,
      read: false
    });

    // Update lastMessageAt
    chat.lastMessageAt = new Date();

    await chat.save();
    console.log("Chat saved successfully. Total messages:", chat.messages.length);

    res.json({
      success: true,
      chat: {
        _id: chat._id,
        messages: chat.messages
      }
    });

  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ 
      message: "Failed to send message",
      error: error.message
    });
  }
};


// Add this temporary test endpoint
exports.testSystemMessage = async (req, res) => {
  try {
    console.log("\n🧪 TESTING SYSTEM MESSAGE");
    
    // Get user ID from multiple possible locations
    const userId = req.user.uid || req.user.user_id || req.user.sub;
    const userEmail = req.user.email;

    console.log("Test for user:", userId, userEmail);

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID not found in token",
        user: req.user 
      });
    }
    
    // Create a test message object
    const testMessage = {
      sender: "system",
      text: "This is a test system message",
      type: "system",
      orderId: null,
      read: false
    };
    
    console.log("Test message object:", testMessage);
    
    // Find or create chat
    let chat = await Contact.findOne({ userId });
    
    if (!chat) {
      chat = new Contact({
        userId: userId,
        email: userEmail,
        messages: []
      });
    }
    
    // Push test message
    chat.messages.push(testMessage);
    chat.lastMessageAt = new Date();
    
    // Save
    const saved = await chat.save();
    console.log("Saved successfully. Messages now:", saved.messages.length);
    
    // Find the system message we just added
    const justAdded = saved.messages[saved.messages.length - 1];
    console.log("Last message saved:", {
      sender: justAdded.sender,
      text: justAdded.text,
      type: justAdded.type
    });
    
    res.json({
      success: true,
      message: "Test system message added",
      data: {
        chatId: saved._id,
        lastMessage: justAdded
      }
    });
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
};

/* ============================
   USER: GET MY CHAT
============================ */
exports.getMyMessages = async (req, res) => {
  try {
    // Get user ID from multiple possible locations
    const userId = req.user.uid || req.user.user_id || req.user.sub;
    
    console.log("Fetching messages for user:", userId);

    if (!userId) {
      return res.status(400).json({ 
        message: "User ID not found in token",
        user: req.user 
      });
    }
    
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
    
    console.log(`Found chat with ${chat.messages.length} messages`);
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

    // Now mongoose will be defined here too
    let validOrderId = null;
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      validOrderId = orderId;
    }

    // ADMIN REPLY
    chat.messages.push({
      sender: "admin",
      text,
      type: orderId ? "order" : "normal",
      orderId: validOrderId
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