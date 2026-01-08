const Address = require("../models/Address");

// ➕ ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const { userId, address, type, isDefault } = req.body;

    if (!userId || !address) {
      return res.status(400).json({ message: "userId and address are required" });
    }

    // If new address is default → remove old default
    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const newAddress = await Address.create({
      userId,
      address,
      type,
      isDefault
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📥 GET ALL USER ADDRESSES
exports.getAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({ userId }).sort({
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
    const { address, type, isDefault, userId } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );
    }

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      { address, type, isDefault },
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
    const deleted = await Address.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
