// src/controllers/userController.js
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import generateToken from '../utils/generateTokens.js';

/**
 * @desc    Get user profile (protected)
 */
const getProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isActive: req.user.isActive,
    });
  } else {
    // Return JSON instead of throwing error
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

/**
 * @desc    Register new user
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address,
    isActive: true,
  });

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'User registered successfully',
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data'
    });
  }
});

/**
 * @desc    Authenticate user & get token
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    
    // SECURITY: Prevent blocked users from logging in
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: "Login successful"
    });
  } else {
    // Return JSON for invalid credentials
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

const userController = {
  registerUser,
  loginUser,
  getProfile,
};

export default userController;