// src/routes/userRoutes.js
import { Router } from 'express';
import  userController from '../controllers/userController.js';
const router = Router();

// Route for /api/users/register
router.post('/register', userController.registerUser);

// Route for /api/users/login
router.post('/login', userController.loginUser);
export default router;