const admin = require("firebase-admin");

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.split("Bearer ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format" 
      });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || decodedToken.email_address || "",
      name: decodedToken.name || "",
    };
    
    console.log(`✅ Authenticated user: ${req.user.email}`);
    next();
    
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    
    // Specific error messages
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired. Please login again." 
      });
    }
    
    if (error.code === "auth/argument-error") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token." 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: "Not authorized" 
    });
  }
};

module.exports = protect;