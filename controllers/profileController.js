const User = require("../models/User");
const fs = require("fs");
const path = require("path");

/* =========================
   🟢 GET PROFILE
========================= */
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
        lastLogin: new Date(),
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
        photo: user.photo || "",
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
    });
  }
};

/* =========================
   🟡 UPDATE PROFILE
   (name, mobile, photo upload,
    photo permanent delete)
========================= */
exports.updateProfile = async (req, res) => {
  try {
    console.log("✏️ Updating profile for:", req.user.email);
    console.log("Update data:", req.body);

    const { name, mobile, removePhoto } = req.body;

    // Validation
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be 10 digits",
      });
    }

    // Check if mobile exists for another user
    if (mobile) {
      const existingMobile = await User.findOne({
        mobile,
        uid: { $ne: req.user.uid },
      });

      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already registered",
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile;

    /* 🔴 PERMANENT PHOTO DELETE (FIXED PATH ISSUE ONLY) */
    if (removePhoto === "true") {
      const existingUser = await User.findOne({ uid: req.user.uid });

      if (existingUser?.photo) {
        // 🔧 FIX: remove leading slash
        const relativePath = existingUser.photo.replace(/^\/+/, "");
        const filePath = path.join(__dirname, "..", relativePath);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      updateData.photo = "";
    }

    /* 🟢 NEW PHOTO UPLOAD */
    if (req.file) {
      updateData.photo = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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
        photo: user.photo || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);

    if (error.code === 11000 && error.keyPattern?.mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};

/* =========================
   🟡 CREATE / REGISTER PROFILE
========================= */
exports.createProfile = async (req, res) => {
  try {
    console.log("📝 Creating profile for:", req.user.email);
    console.log("Registration data:", req.body);

    const { name, mobile } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be 10 digits",
      });
    }

    let user = await User.findOne({ uid: req.user.uid });

    if (user) {
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
          photo: user.photo || "",
          role: user.role,
        },
      });
    }

    user = await User.create({
      uid: req.user.uid,
      email: req.user.email,
      name: name.trim(),
      mobile: mobile || "",
      role: "user",
      emailVerified: true,
      lastLogin: new Date(),
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
        photo: user.photo || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Create profile error:", error);

    if (error.code === 11000 && error.keyPattern?.mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error creating profile",
    });
  }
};

/* =========================
   🔴 DELETE PROFILE
   (user + photo delete)
========================= */
exports.deleteProfile = async (req, res) => {
  try {
    console.log("🗑️ Deleting profile for:", req.user.email);

    const user = await User.findOne({ uid: req.user.uid });

    if (user?.photo) {
      // 🔧 FIX: remove leading slash
      const relativePath = user.photo.replace(/^\/+/, "");
      const filePath = path.join(__dirname, "..", relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await User.findOneAndDelete({ uid: req.user.uid });

    console.log("✅ Profile deleted successfully");

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting profile",
    });
  }
};
