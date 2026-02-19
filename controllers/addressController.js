const Address = require("../models/Address");

// ➕ ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const { address, type, isDefault, lat, lng } = req.body;
    const uid = req.user.uid;

    if (!address) {
      return res.status(400).json({ message: "Address required" });
    }

    if (isDefault) {
      await Address.updateMany({ uid }, { isDefault: false });
    }

    const newAddress = await Address.create({
      uid,
      address,
      type,
      isDefault,
      lat,
      lng
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏ UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { address, type, isDefault, lat, lng } = req.body;

    if (isDefault) {
      await Address.updateMany({ uid }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, uid },
      { address, type, isDefault, lat, lng },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
