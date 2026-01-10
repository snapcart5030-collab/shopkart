const User = require("../models/User");

// 🟢 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    console.log("📋 Getting profile for user:", req.user.email);
    
    let user = await User.findOne({ uid: req.user.uid });

    // First time login - create profile
    if (!user) {
      console.log("👤 Creating new user in database");
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name || "",
        mobile: "",
        role: "user",
        emailVerified: true,
        lastLogin: new Date()
      });
      console.log("✅ New user created in database");
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      console.log("✅ Existing user found");
    }

    res.json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching profile" 
    });
  }
};

// 🟡 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    console.log("✏️ Updating profile for:", req.user.email);
    console.log("Update data:", req.body);
    
    const { name, mobile } = req.body;
    
    // Validation
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ 
        success: false,
        message: "Mobile number must be 10 digits" 
      });
    }

    // Check if mobile exists for another user
    if (mobile) {
      const existingMobile = await User.findOne({ 
        mobile, 
        uid: { $ne: req.user.uid } 
      });
      
      if (existingMobile) {
        return res.status(400).json({ 
          success: false,
          message: "Mobile number already registered" 
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile;

    // Update user
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("✅ Profile updated successfully");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      }
    });
    
  } catch (error) {
    console.error("❌ Update profile error:", error);
    
    if (error.code === 11000 && error.keyPattern.mobile) {
      return res.status(400).json({ 
        success: false,
        message: "Mobile number already registered" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error updating profile" 
    });
  }
};

// 🟡 CREATE/REGISTER PROFILE
exports.createProfile = async (req, res) => {
  try {
    console.log("📝 Creating profile for:", req.user.email);
    console.log("Registration data:", req.body);
    
    const { name, mobile } = req.body;
    
    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ 
        success: false,
        message: "Name is required" 
      });
    }

    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ 
        success: false,
        message: "Mobile number must be 10 digits" 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ uid: req.user.uid });
    
    if (user) {
      // Update existing user
      user.name = name.trim();
      user.mobile = mobile || "";
      await user.save();
      
      console.log("✅ Existing user updated");
      
      return res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          uid: user.uid,
          email: user.email,
          name: user.name,
          mobile: user.mobile,
          role: user.role
        }
      });
    }

    // Create new user
    user = await User.create({
      uid: req.user.uid,
      email: req.user.email,
      name: name.trim(),
      mobile: mobile || "",
      role: "user",
      emailVerified: true,
      lastLogin: new Date()
    });
    
    console.log("✅ New user created in database");

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error("❌ Create profile error:", error);
    
    if (error.code === 11000 && error.keyPattern.mobile) {
      return res.status(400).json({ 
        success: false,
        message: "Mobile number already registered" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error creating profile" 
    });
  }
};

// 🔴 DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    console.log("🗑️ Deleting profile for:", req.user.email);
    
    const user = await User.findOneAndDelete({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log("✅ Profile deleted successfully");

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
    
  } catch (error) {
    console.error("❌ Delete profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error deleting profile" 
    });
  }
};