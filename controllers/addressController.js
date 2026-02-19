const Address = require("../models/Address");

// ➕ ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const { Name, Mobile, HNo, locality, City, State, Pincode, LandMark, Type, lat, lng } = req.body;
    const uid = req.user.uid;

    // Check if this is the first address (make it default)
    const addressCount = await Address.countDocuments({ uid });
    const isDefault = addressCount === 0; // First address becomes default

    const newAddress = await Address.create({
      uid,
      Name,
      Mobile,
      HNo,
      locality,
      City,
      State,
      Pincode,
      LandMark,
      Type,
      lat,
      lng,
      isDefault
    });

    res.status(201).json({
      success: true,
      address: newAddress,
      message: "Address added successfully"
    });
  } catch (error) {
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
    const { Name, Mobile, HNo, locality, City, State, Pincode, LandMark, Type, lat, lng, isDefault } = req.body;

    // If setting this address as default, remove default from others
    if (isDefault) {
      await Address.updateMany({ uid, _id: { $ne: req.params.id } }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, uid },
      { 
        Name, Mobile, HNo, locality, City, State, Pincode, 
        LandMark, Type, lat, lng, isDefault 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    res.json({
      success: true,
      address: updated,
      message: "Address updated successfully"
    });
  } catch (error) {
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

    const deleted = await Address.findOneAndDelete({
      _id: req.params.id,
      uid
    });

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    // If deleted address was default, make another address default if exists
    if (deleted.isDefault) {
      const anotherAddress = await Address.findOne({ uid });
      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    res.json({ 
      success: true, 
      message: "Address deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const uid = req.user.uid;
    const addressId = req.params.id;

    // Remove default from all addresses
    await Address.updateMany({ uid }, { isDefault: false });

    // Set new default
    const updated = await Address.findOneAndUpdate(
      { _id: addressId, uid },
      { isDefault: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    }

    res.json({
      success: true,
      address: updated,
      message: "Default address updated"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};