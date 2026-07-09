const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { mobile, name, email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const exists = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { mobile: mobile }] 
    });
    
    if (exists) {
      return res.status(400).json({ 
        message: exists.email === email.toLowerCase() 
          ? "Email already registered" 
          : "Mobile number already registered" 
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name || "",
      mobile: mobile || "",
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        gender: user.gender,
        age: user.age,
        photo: user.photo,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// CHECK EMAIL EXISTS
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    res.json({
      exists: !!user,
      email: email.toLowerCase()
    });

  } catch (err) {
    console.error("Check Email Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ error: err.message });
  }
};