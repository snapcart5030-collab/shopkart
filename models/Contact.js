const mongoose = require("mongoose");

// Sub-schema for individual messages
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: [true, "Sender is required"]
  },
  text: {
    type: String,
    required: [true, "Message text is required"],
    trim: true
  }
}, {
  timestamps: true
});

// Main contact schema for user conversations
const contactSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
    index: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true
  },
  messages: [messageSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for last message
contactSchema.virtual("lastMessage").get(function() {
  if (this.messages && this.messages.length > 0) {
    return this.messages[this.messages.length - 1];
  }
  return null;
});

// Virtual for unread count (if you want to add an isRead field later)
contactSchema.virtual("unreadCount").get(function() {
  return this.messages ? this.messages.filter(m => !m.isRead).length : 0;
});

// Index for efficient queries
contactSchema.index({ updatedAt: -1 });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;