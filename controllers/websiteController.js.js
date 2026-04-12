let isWebsiteOn = true; // Global state (will reset on server restart)

// 👉 toggle ON/OFF
exports.toggleWebsite = (req, res) => {
  isWebsiteOn = !isWebsiteOn;
  
  console.log(`Website status toggled to: ${isWebsiteOn ? "ON" : "OFF"}`);
  
  res.json({
    success: true,
    websiteStatus: isWebsiteOn ? "ON" : "OFF"
  });
};

// 👉 status check
exports.getWebsiteStatus = (req, res) => {
  res.json({
    websiteStatus: isWebsiteOn ? "ON" : "OFF"
  });
};

// 👉 middleware - EXCLUDE toggle endpoint from blocking
exports.checkWebsiteStatus = (req, res, next) => {
  // Allow toggle endpoint and status endpoint even when website is OFF
  const allowedPaths = ["/api/website/toggle", "/api/website/status"];
  
  if (!isWebsiteOn && !allowedPaths.includes(req.path)) {
    return res.status(503).json({
      success: false,
      message: "🚫 Website is currently down for maintenance"
    });
  }
  next();
};