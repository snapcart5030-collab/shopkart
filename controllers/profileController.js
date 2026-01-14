const User = require("../models/User");
const fs = require("fs");
const path = require("path");

// 🟢 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: true,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// 🟡 UPDATE PROFILE (name, mobile, photo optional + PERMANENT DELETE)
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, removePhoto } = req.body;

    // mobile validation
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile must be 10 digits",
      });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile;

    // 🔴 PERMANENT PHOTO DELETE
    if (removePhoto === "true") {
      const existingUser = await User.findOne({ uid: req.user.uid });

      if (existingUser?.photo) {
        const filePath = path.join(
          __dirname,
          "..",
          existingUser.photo // "/uploads/profile/xyz.jpg"
        );

        // delete image from disk
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      updateData.photo = "";
    }

    // 🟢 NEW PHOTO UPLOAD
    if (req.file) {
      updateData.photo = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// 🔴 DELETE PROFILE (user + photo)
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

    if (user?.photo) {
      const filePath = path.join(__dirname, "..", user.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await User.findOneAndDelete({ uid: req.user.uid });

    res.json({
      success: true,
      message: "Profile deleted",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
    });
  }
};
