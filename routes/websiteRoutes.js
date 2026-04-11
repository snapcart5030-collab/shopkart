const express = require("express");
const router = express.Router();

const {
  toggleWebsite,
  getWebsiteStatus
} = require("../controllers/websiteController.js");

// toggle ON/OFF
router.post("/toggle", toggleWebsite);

// get status
router.get("/status", getWebsiteStatus);

module.exports = router;