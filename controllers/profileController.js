const User = require("../models/User");

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
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });
  }
};

// 🟡 UPDATE PROFILE (name, mobile, photo optional)
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (mobile && !/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Mobile must be 10 digits",
      });
    }

    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (mobile !== undefined) updateData.mobile = mobile;

    // Photo upload
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
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

// 🔴 DELETE PROFILE
exports.deleteProfile = async (req, res) => {
  try {
    await User.findOneAndDelete({ uid: req.user.uid });

    res.json({
      success: true,
      message: "Profile deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
    });
  }
};
