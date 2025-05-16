import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register a new user (admin or agent)
// @route   POST /api/auth/register
// @access  Public (use once to seed an initial admin)
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  // Multer stores the uploaded file in req.file
  const avatarFilename = req.file ? req.file.filename : undefined;

  try {
    // Prevent duplicate emails
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Build user data and include avatar if provided
    const userData = { name, email, password, role };
    if (avatarFilename) userData.avatar = avatarFilename;

    const user = await User.create(userData);

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/signin
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find & select hashed password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Logout user (client should clear token too)
// @route   POST /api/auth/logout
// @access  Public (token is on client, this just helps standardize logout)
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};