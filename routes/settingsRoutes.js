const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Check if all dependencies are properly imported
console.log('getSettings type:', typeof getSettings);
console.log('updateSettings type:', typeof updateSettings);
console.log('protect type:', typeof protect);
console.log('admin type:', typeof admin);

// All settings routes require admin authentication
router.route('/')
  .get(protect, admin, getSettings)
  .put(protect, admin, updateSettings);

module.exports = router;