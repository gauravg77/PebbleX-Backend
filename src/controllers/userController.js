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

  const message = `You requested a password reset. Use the following code to reset your password: ${resetToken}`;

  // Execute email sending logic
  const emailResult = await sendEmail({ 
    email: user.email, 
    subject: 'PebbleX Password Reset', 
    message 
  });

  if (emailResult.success) {
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } else {
    console.error("Email sending failed:", emailResult.error);
    return res.status(500).json({
      success: false,
      message: 'Error sending email. Check terminal for details.'
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

/**
 * @desc    Verify Reset Token
 */
const verifyResetToken = asyncHandler(async (req, res) => {
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

  return res.status(200).json({
    success: true,
    message: 'Token is valid. You can proceed to reset your password.'
  });
});


export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1. Get user from DB (must include password field)
    const user = await User.findById(req.user._id).select('+password');

    // 2. Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // 3. Update to new password
    user.password = newPassword;
    await user.save(); // This will trigger your pre-save password hashing

    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update basic profile info (name/email)
export const updateMe = async (req, res) => {
  try {
    // 1. Prevent password updates in this route
    if (req.body.password || req.body.currentPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'This route is not for password updates. Please use /update-my-password.' 
      });
    }

    // 2. Filter the body to only allow specific fields
    const filteredBody = {};
    if (req.body.name) filteredBody.name = req.body.name;
    if (req.body.email) filteredBody.email = req.body.email;

    // 3. Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      filteredBody, 
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const userController = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  updatePassword,
  updateMe
};

export default userController;