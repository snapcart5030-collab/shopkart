const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // 1️⃣ Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    // 3️⃣ Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token expired or invalid"
      });
    }

    // 4️⃣ Find user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // 5️⃣ Attach user info to request
    req.user = {
      id: user._id.toString()
    };

    // ✅ Continue to next middleware / controller
    next();

  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

module.exports = protect;
