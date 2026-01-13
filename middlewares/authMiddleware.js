const admin = require("../config/firebaseAdmin");

const protect = async (req, res, next) => {
  try {
    console.log("\n🔐 Auth Middleware Called");
    console.log("URL:", req.originalUrl);

    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
      });
    }

    // 2️⃣ Extract token (Bearer or raw)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // 3️⃣ Verify Firebase ID Token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid. Please login again."
      });
    }

    // 4️⃣ Email verification check
    if (!decodedToken.email_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login"
      });
    }

    // 5️⃣ Attach authenticated user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };

    console.log("✅ Authenticated User:", req.user.email);
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = protect;
