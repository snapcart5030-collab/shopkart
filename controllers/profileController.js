const User = require("../models/User");

// 🟢 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    // First time login - auto create profile
    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name || "",
      });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      message: "Server error fetching profile" 
    });
  }
};

// 🟡 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    // Validation
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ 
        message: "Mobile number must be 10 digits" 
      });
    }

    // Check if mobile already exists (if provided)
    if (mobile) {
      const existingMobile = await User.findOne({ 
        mobile, 
        uid: { $ne: req.user.uid } 
      });
      
      if (existingMobile) {
        return res.status(400).json({ 
          message: "Mobile number already registered" 
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile || null;

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
        message: "Profile not found" 
      });
    }

    res.json({
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
    console.error("Update profile error:", error);
    
    if (error.code === 11000 && error.keyPattern.mobile) {
      return res.status(400).json({ 
        message: "Mobile number already registered" 
      });
    }
    
    res.status(500).json({ 
      message: "Server error updating profile" 
    });
  }
};

// 🔴 DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ uid: req.user.uid });

    if (!user) {
      return res.status(404).json({ 
        message: "Profile not found" 
      });
    }

    res.json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ 
      message: "Server error deleting profile" 
    });
  }
};