const User = require("../models/User");


// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find({})
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      totalUsers: users.length,
      users,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    let user = await User.findOne({ uid: req.user.uid });

    // First time login → create user
    if (!user) {
      user = await User.create({
        uid: req.user.uid,
        email: req.user.email,
      });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {

    const { name, mobile, gender, age } = req.body;

    const updateData = {
      name: name || "",
      mobile: mobile || "",
      gender: gender || null,
      age: age ? Number(age) : null,
    };

    if (req.file) {
      updateData.photo = `/uploads/profile/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};