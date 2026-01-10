const admin = require("../config/firebaseAdmin");

const protect = async (req, res, next) => {
  try {
    console.log("\n🔐 Auth Middleware Called");
    console.log("URL:", req.originalUrl);
    console.log("Headers:", Object.keys(req.headers));

    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log("❌ No Authorization header");
      return res.status(401).json({ 
        success: false,
        message: "No authorization token provided" 
      });
    }

    // Extract token (handle both "Bearer token" and just "token")
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
    
    console.log("Token length:", token.length);
    console.log("Token (first 30 chars):", token.substring(0, 30) + "...");

    if (!token || token === "null" || token === "undefined") {
      console.log("❌ Token is empty or invalid");
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }

    // Verify Firebase token
    console.log("Verifying token...");
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Token verified successfully!");
      console.log("User UID:", decodedToken.uid);
      console.log("User Email:", decodedToken.email || "No email");
    } catch (verifyError) {
      console.error("❌ Token verification failed:", verifyError.message);
      console.error("Error code:", verifyError.code);
      
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again."
      });
    }

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "",
    };
    
    console.log("✅ User authenticated:", req.user.email);
    console.log("🔐 Auth Middleware Complete\n");
    
    next();
    
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = protect;