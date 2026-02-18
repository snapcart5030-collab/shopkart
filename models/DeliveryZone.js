const mongoose = require("mongoose");

const deliveryZoneSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true
  },
  city: String,
  state: String,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);
