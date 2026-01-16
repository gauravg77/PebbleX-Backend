// src/routes/userRoutes.js
import { Router } from 'express';
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRoutes = Router();

// Public routes
userRoutes.post('/register', userController.registerUser);
userRoutes.post('/login', userController.loginUser);

// Protected routes (require token)
userRoutes.get('/profile', protect, userController.getProfile);

export default userRoutes;