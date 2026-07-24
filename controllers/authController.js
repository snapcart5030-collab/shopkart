const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// ================= CHECK EMAIL EXISTS =================
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ message: "Server error checking email" });
  }
};

// ================= REGISTER USER =================
exports.register = async (req, res) => {
  try {
    console.log("📝 Registration request body:", req.body);

    const { name, email, password, mobile } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ 
        message: "All fields are required: name, email, password, mobile" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
      mobile: mobile.trim(),
    });

    // Save user (this will trigger the pre-save hook)
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      photo: user.photo,
      gender: user.gender,
      age: user.age,
      createdAt: user.createdAt,
    };

    console.log("✅ User registered successfully:", userData);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false,
      message: error.message || "Registration failed" 
    });
  }
};

// ================= LOGIN USER =================
exports.login = async (req, res) => {
  try {
    console.log("📝 Login request:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      photo: user.photo,
      gender: user.gender,
      age: user.age,
    };

    console.log("✅ Login successful:", userData);

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Login failed" 
    });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobile, photo, gender, age } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (mobile) updateData.mobile = mobile.trim();
    if (photo) updateData.photo = photo;
    if (gender) updateData.gender = gender;
    if (age) updateData.age = Number(age);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};