const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.getProfileById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};exports.updateAdmin = async (req, res) => {
  try {
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.params.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Password change failed" });
  }
};
// ================= REGISTER =================
exports.registerAdmin = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      status: "pending",
    });

    res.json({ message: "Admin registered. Waiting for approval" });
  } catch (err) {
    res.status(500).json({ message: "Admin register failed" });
  }
};

// ================= LOGIN =================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (admin.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Approval pending" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, name: admin.name });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= GET ALL ADMINS =================
exports.getAdmins = async (req, res) => {
  const admins = await Admin.find().select("-password");
  res.json(admins);
};

// ================= APPROVE ADMIN =================
exports.approveAdmin = async (req, res) => {
  await Admin.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  res.json({ message: "Admin approved successfully" });
};

// ================= UPDATE ADMIN =================
exports.updateAdmin = async (req, res) => {
  const updated = await Admin.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// ================= DELETE ADMIN =================
exports.deleteAdmin = async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted successfully" });
};