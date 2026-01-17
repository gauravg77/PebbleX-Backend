// src/controllers/userController.js
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/user.js';
import generateToken from '../utils/generateTokens.js';
import sendEmail from '../utils/sendEmail.js';

/**
 * @desc    Get user profile (protected)
 */
const getProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive: req.user.isActive,
      }
    });
  } else {
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

  const normalizedRole = role ? role.toUpperCase() : "VENDOR";

  const user = await User.create({
    name, email, password,
    role: normalizedRole,
    phone, address,
    isActive: true,
  });

  if (user) {
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
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
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

/**
 * @desc    Forgot Password - Sends Reset Email
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with that email address'
    });
  }

  // Generate Token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
  const message = `You requested a password reset. Link: ${resetUrl}`;

  // Execute email sending logic
  const emailResult = await sendEmail({ 
    email: user.email, 
    subject: 'PebbleX Password Reset', 
    message 
  }).catch((err) => {
    console.error("DEBUG: Email failed but here is your token for testing ->", resetToken);
    return null; 
  });

  if (emailResult) {
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } else {
    // If it fails, we still return JSON. 
    // I am NOT cleaning up the token here so you can still use the token from your terminal to test resetPassword
    return res.status(500).json({
      success: false,
      message: 'Error sending email. Check terminal for the manual test token.'
    });
  }
});

/**
 * @desc    Reset Password using Token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Token is invalid or has expired'
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now log in.'
  });
});

const userController = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword
};

export default userController;