// src/routes/userRoutes.js
import { Router } from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userrouter = Router();

// Public routes
userrouter.post('/register', userController.registerUser);
userrouter.post('/login', userController.loginUser);

// Protected routes (require token)
userrouter.get('/profile', protect, userController.getProfile);

export default userrouter;