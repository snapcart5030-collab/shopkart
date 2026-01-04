const Address = require("../models/Address");

// ➕ ADD ADDRESS
exports.addAddress = async (req, res) => {
  const { userId, address, type, isDefault } = req.body;

  if (isDefault) {
    await Address.updateMany(
      { userId },
      { isDefault: false }
    );
  }

  const newAddress = await Address.create({
    userId,
    address,
    type,
    isDefault
  });

  res.json(newAddress);
};

// 📥 GET USER ADDRESSES
exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({ userId: req.params.userId });
  res.json(addresses);
};

// ✏ UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
  const { address, type, isDefault } = req.body;

  if (isDefault) {
    await Address.updateMany(
      { userId: req.body.userId },
      { isDefault: false }
    );
  }

  const updated = await Address.findByIdAndUpdate(
    req.params.id,
    { address, type, isDefault },
    { new: true }
  );

  res.json(updated);
};

// ❌ DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
  await Address.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
