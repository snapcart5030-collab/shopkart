const Settings = require('../models/Settings');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    const { storeName, storeEmail, paymentMethods, currency, taxRate, shippingFee } = req.body;
    
    let settings = await Settings.getSettings();
    
    // Update fields
    if (storeName) settings.storeName = storeName;
    if (storeEmail) settings.storeEmail = storeEmail;
    if (paymentMethods) settings.paymentMethods = paymentMethods;
    if (currency) settings.currency = currency;
    if (taxRate !== undefined) settings.taxRate = taxRate;
    if (shippingFee !== undefined) settings.shippingFee = shippingFee;
    
    settings.updatedBy = req.user._id;
    
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};