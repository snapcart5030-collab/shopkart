const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    console.log("\n🔐 Auth Middleware Called");
    console.log("URL:", req.originalUrl);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    // Attach user to request
    req.user = user;
    console.log("✅ Authenticated User:", user.email);

    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = protect;