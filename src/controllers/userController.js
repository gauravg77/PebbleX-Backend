// src/controllers/userController.js
import asyncHandler from 'express-async-handler';
import User from '../models/user.js'; // User model
import generateToken from '../utils/generateTokens.js';

// @desc    Get user profile (protected)
// @route   GET /api/v1/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    message: 'User profile retrieved',
    user: req.user,
  });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // 2. Create the User (password hashing happens in the model's .pre('save') middleware)
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address,
  });

  if (user) {
    // 3. Create the corresponding Supplier or Vendor profile
    // If you have Supplier or Vendor models, create their profiles here.
    // Currently omitted because `Supplier` and `Vendor` models are not present.
    
    // 4. Send success response with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'User registered successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });

  // 2. Check password
  if (user && (await user.matchPassword(password))) {
    // 3. Send success response with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message:"Login successful"
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});
const userController = {
  registerUser,
  loginUser,
  getProfile,
};

export default userController;