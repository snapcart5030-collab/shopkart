let isWebsiteOn = true;

// 👉 toggle ON/OFF
exports.toggleWebsite = (req, res) => {
  isWebsiteOn = !isWebsiteOn;

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

// 👉 middleware use साठी
exports.checkWebsiteStatus = (req, res, next) => {
  if (!isWebsiteOn && req.path !== "/api/toggle-website") {
    return res.status(503).json({
      message: "🚫 Website is currently down"
    });
  }
  next();
};