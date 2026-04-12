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

// 👉 middleware - EXCLUDE admin routes from blocking
exports.checkWebsiteStatus = (req, res, next) => {
  // Allow admin routes and toggle endpoints even when website is OFF
  const allowedPaths = [
    "/api/website/toggle", 
    "/api/website/status",
    "/api/admin",
    "/api/admin/orders",
    "/api/auth"
  ];
  
  // Check if current path starts with any allowed path
  const isAllowed = allowedPaths.some(path => req.path.startsWith(path));
  
  if (!isWebsiteOn && !isAllowed) {
    return res.status(503).json({
      success: false,
      message: "🚫 Website is currently down for maintenance"
    });
  }
  next();
};