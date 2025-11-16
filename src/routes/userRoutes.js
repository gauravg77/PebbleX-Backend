// src/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Route for /api/users/register
router.post('/register', registerUser);

// Route for /api/users/login
router.post('/login', loginUser);

module.exports = router;