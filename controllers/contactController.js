const Contact = require("../models/Contact");

/* ============================
   USER: SEND MESSAGE
============================ */
exports.sendMessage = async (req, res) => {
  const { message, orderId } = req.body;

  // DEBUG: Log incoming request
  console.log("\n🔵 NEW MESSAGE REQUEST");
  console.log("Message:", message);
  console.log("OrderId:", orderId);
  console.log("User:", req.user?.uid, req.user?.email);

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    const userId = req.user.uid;
    const userEmail = req.user.email;

    // DEBUG: Check if mongoose is working
    console.log("Mongoose version:", mongoose.version);
    console.log("MongoDB connected?", mongoose.connection.readyState === 1 ? "YES" : "NO");

    let chat = await Contact.findOne({ userId });
    console.log("Chat found:", chat ? chat._id : "No chat found - will create new");

    if (!chat) {
      chat = new Contact({
        userId,
        email: userEmail,
        messages: []
      });
      console.log("New chat object created");
    }

    // Validate orderId
    let validOrderId = null;
    if (orderId) {
      const isValid = mongoose.Types.ObjectId.isValid(orderId);
      console.log("OrderId valid?", isValid);
      if (isValid) {
        validOrderId = orderId;
      }
    }

    // Push user message
    const userMessage = {
      sender: "user",
      text: message,
      type: validOrderId ? "order" : "normal",
      orderId: validOrderId
    };
    
    chat.messages.push(userMessage);
    console.log("✅ User message added. Total messages:", chat.messages.length);

    // Push system message
    const systemMessage = {
      sender: "system",
      text: "Hi 👋 Thank you for contacting ShopKart Support. Our team will reply shortly. Please relax 😊",
      type: "system",
      orderId: null
    };
    
    chat.messages.push(systemMessage);
    console.log("✅ System message added. Total messages:", chat.messages.length);

    // DEBUG: Show messages before save
    console.log("\nMessages before save:");
    chat.messages.forEach((msg, i) => {
      console.log(`  ${i+1}. ${msg.sender}: ${msg.text.substring(0, 30)}...`);
    });

    // Save with explicit error handling
    try {
      const savedChat = await chat.save();
      console.log("\n✅ CHAT SAVED SUCCESSFULLY");
      console.log("Saved chat ID:", savedChat._id);
      console.log("Total messages saved:", savedChat.messages.length);
      
      // Verify system message was saved
      const hasSystemMessage = savedChat.messages.some(m => m.sender === 'system');
      console.log("System message in saved chat:", hasSystemMessage ? "YES" : "NO");

      res.json({
        success: true,
        chat: {
          _id: savedChat._id,
          messages: savedChat.messages
        }
      });

    } catch (saveError) {
      console.error("❌ ERROR SAVING CHAT:", saveError);
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        console.error("Validation errors:", saveError.errors);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: saveError.errors 
        });
      }
      
      throw saveError;
    }

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
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
    
    // Create a test message object
    const testMessage = {
      sender: "system",
      text: "This is a test system message",
      type: "system",
      orderId: null,
      read: false
    };
    
    console.log("Test message object:", testMessage);
    
    // Try to validate against schema
    const Contact = require("../models/Contact");
    
    // Create a temporary chat or use existing
    const userId = req.user.uid;
    let chat = await Contact.findOne({ userId });
    
    if (!chat) {
      chat = new Contact({
        userId: userId,
        email: req.user.email,
        messages: []
      });
    }
    
    // Push test message
    chat.messages.push(testMessage);
    console.log("Message pushed. Total messages:", chat.messages.length);
    
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
      orderId: orderId && mongoose.Types.ObjectId.isValid(orderId)
  ? orderId
  : null
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