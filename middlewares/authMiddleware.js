const admin = require("../config/firebaseAdmin");

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

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token, true);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid. Please login again.",
      });
    }

    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email.",
      });
    }

    // ✅ IMPORTANT CHANGE HERE
    req.user = decodedToken;

    console.log("✅ Authenticated User:", decodedToken.email);
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
