const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'E-Shop'
  },
  storeEmail: {
    type: String,
    default: 'admin@eshop.com'
  },
  paymentMethods: {
    creditCard: {
      type: Boolean,
      default: true
    },
    paypal: {
      type: Boolean,
      default: true
    },
    cashOnDelivery: {
      type: Boolean,
      default: true
    }
  },
  currency: {
    type: String,
    default: 'USD'
  },
  taxRate: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);