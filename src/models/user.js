// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <-- Require bcryptjs

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Supplier', 'Vendor'], required: true },
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });

// 1. Method to compare passwords (used for login)
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // Compares the entered password with the hashed password stored in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Middleware to hash password (used before saving/registration)
UserSchema.pre('save', async function(next) {
  // Only run this if the password field was actually modified
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);