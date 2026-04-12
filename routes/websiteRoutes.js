const express = require("express");
const router = express.Router();

const {
  toggleWebsite,
  getWebsiteStatus
} = require("../controllers/websiteController.js");

// toggle ON/OFF (POST)
router.post("/toggle", toggleWebsite);

// get status (GET)
router.get("/status", getWebsiteStatus);

module.exports = router;