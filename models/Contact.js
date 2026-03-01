const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String, // "user" | "admin" | "system"
      required: true,
      enum: ["user", "admin", "system"]
    },
    text: {
      type: String,
      required: true
    },
    type: {
      type: String, // "normal" | "order" | "system"
      default: "normal",
      enum: ["normal", "order", "system"]
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    messages: [messageSchema],
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Update lastMessageAt when new message is added
contactSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    this.lastMessageAt = new Date();
  }
  next();
});

// Virtual for unread count
contactSchema.virtual('unreadCount').get(function() {
  return this.messages.filter(m => !m.read && m.sender !== 'user').length;
});

module.exports = mongoose.model("Contact", contactSchema);