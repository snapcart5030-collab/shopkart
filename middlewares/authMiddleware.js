const admin = require("firebase-admin");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Unauthorized. No token provided." 
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Unauthorized. Invalid token format." 
      });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || "",
    };
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ 
        message: "Token expired. Please login again." 
      });
    }
    
    if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({ 
        message: "Token revoked. Please login again." 
      });
    }
    
    res.status(401).json({ 
      message: "Unauthorized. Invalid token." 
    });
  }
};

module.exports = protect;