const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    uid: {
      type: String, // Firebase UID
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["HOME", "OFFICE", "DELIVERY", "OTHER"],
      default: "HOME"
    },

    // Full address string
    address: {
      type: String,
      required: true,
      trim: true
    },

    // Structured address for better management
    houseNo: {
      type: String,
      trim: true
    },
    
    area: {
      type: String,
      trim: true
    },
    
    landmark: {
      type: String,
      trim: true
    },
    
    city: {
      type: String,
      trim: true
    },
    
    state: {
      type: String,
      trim: true
    },
    
    pincode: {
      type: String,
      trim: true
    },

    // Location coordinates
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false
      }
    },

    // For backward compatibility
    lat: Number,
    lng: Number,

    // Contact details
    contactName: {
      type: String,
      trim: true
    },
    
    contactPhone: {
      type: String,
      trim: true
    },

    isDefault: {
      type: Boolean,
      default: false
    },

    // Label for the address
    label: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create 2dsphere index for geospatial queries
addressSchema.index({ location: '2dsphere' });

// Virtual for formatted address display
addressSchema.virtual('formattedAddress').get(function() {
  const parts = [];
  if (this.houseNo) parts.push(this.houseNo);
  if (this.area) parts.push(this.area);
  if (this.landmark) parts.push(`near ${this.landmark}`);
  if (this.city) parts.push(this.city);
  if (this.state) parts.push(this.state);
  if (this.pincode) parts.push(this.pincode);
  
  return parts.join(', ') || this.address;
});

module.exports = mongoose.model("Address", addressSchema);