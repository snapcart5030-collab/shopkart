const Address = require("../models/Address");

// ➕ ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const { 
      address, 
      type, 
      isDefault, 
      lat, 
      lng,
      houseNo,
      area,
      landmark,
      city,
      state,
      pincode,
      contactName,
      contactPhone,
      label
    } = req.body;
    
    const uid = req.user.uid;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    // If this address is set as default, unset any existing default
    if (isDefault) {
      await Address.updateMany({ uid }, { isDefault: false });
    }

    // Prepare location data
    const location = {};
    if (lat && lng) {
      location.type = 'Point';
      location.coordinates = [parseFloat(lng), parseFloat(lat)];
    }

    const newAddress = await Address.create({
      uid,
      address: address.trim(),
      type: type || "HOME",
      isDefault: isDefault || false,
      lat: lat || null,
      lng: lng || null,
      location: location.coordinates ? location : undefined,
      houseNo: houseNo || "",
      area: area || "",
      landmark: landmark || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      contactName: contactName || "",
      contactPhone: contactPhone || "",
      label: label || ""
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress
    });
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// 📥 GET ADDRESSES
exports.getAddresses = async (req, res) => {
  try {
    const uid = req.user.uid;

    const addresses = await Address.find({ uid }).sort({
      isDefault: -1,
      createdAt: -1
    });

    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// 📥 GET SINGLE ADDRESS
exports.getAddressById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, uid });

    if (!address) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error("Get address by ID error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ✏ UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const { 
      address, 
      type, 
      isDefault, 
      lat, 
      lng,
      houseNo,
      area,
      landmark,
      city,
      state,
      pincode,
      contactName,
      contactPhone,
      label
    } = req.body;

    // Find the address first to check if it exists
    const existingAddress = await Address.findOne({ _id: id, uid });
    
    if (!existingAddress) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    // If setting as default, unset any existing default
    if (isDefault) {
      await Address.updateMany(
        { uid, _id: { $ne: id } }, 
        { isDefault: false }
      );
    }

    // Prepare update data
    const updateData = {
      address: address?.trim() || existingAddress.address,
      type: type || existingAddress.type,
      isDefault: isDefault !== undefined ? isDefault : existingAddress.isDefault,
      lat: lat !== undefined ? lat : existingAddress.lat,
      lng: lng !== undefined ? lng : existingAddress.lng,
      houseNo: houseNo !== undefined ? houseNo : existingAddress.houseNo,
      area: area !== undefined ? area : existingAddress.area,
      landmark: landmark !== undefined ? landmark : existingAddress.landmark,
      city: city !== undefined ? city : existingAddress.city,
      state: state !== undefined ? state : existingAddress.state,
      pincode: pincode !== undefined ? pincode : existingAddress.pincode,
      contactName: contactName !== undefined ? contactName : existingAddress.contactName,
      contactPhone: contactPhone !== undefined ? contactPhone : existingAddress.contactPhone,
      label: label !== undefined ? label : existingAddress.label
    };

    // Update location if lat/lng provided
    if (lat !== undefined && lng !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      };
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, uid },
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Address updated successfully",
      address: updated
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// ❌ DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({
      _id: id,
      uid
    });

    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: "Address not found" 
      });
    }

    // If we deleted the default address, set another address as default if exists
    if (deleted.isDefault) {
      const nextAddress = await Address.findOne({ uid }).sort({ createdAt: -1 });
      if (nextAddress) {
        await Address.findByIdAndUpdate(nextAddress._id, { isDefault: true });
      }
    }

    res.json({ 
      success: true,
      message: "Address deleted successfully" 
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// 📍 REVERSE GEOCODE (Get address from coordinates)
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false,
        message: "Latitude and longitude are required" 
      });
    }

    // You can use OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0'
        }
      }
    );
    
    const data = await response.json();
    
    if (!data || !data.display_name) {
      return res.status(404).json({ 
        success: false,
        message: "Could not find address for this location" 
      });
    }

    // Extract address components
    const addressComponents = data.address || {};
    
    res.json({
      success: true,
      address: data.display_name,
      houseNo: addressComponents.house_number || "",
      road: addressComponents.road || "",
      neighbourhood: addressComponents.neighbourhood || addressComponents.suburb || "",
      city: addressComponents.city || addressComponents.town || addressComponents.village || "",
      state: addressComponents.state || "",
      country: addressComponents.country || "",
      pincode: addressComponents.postcode || "",
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// 🔍 SEARCH ADDRESSES (optional - for autocomplete)
exports.searchAddresses = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: "Search query is required" 
      });
    }

    const addresses = await Address.find({
      uid,
      $or: [
        { address: { $regex: query, $options: 'i' } },
        { area: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { landmark: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error("Search addresses error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};