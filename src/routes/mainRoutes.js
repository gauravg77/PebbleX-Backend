import { Router } from "express";
import authRoutes from "./userRoutes.js";
import orderRoutes from "./orderRoutes.js";
import productRoutes from "./productRoutes.js";
import adminRoutes from "./adminRoutes.js"; // Added to include your admin features

const mainRoutes = Router();

// Auth routes (Register/Login/Profile)
mainRoutes.use('/auth', authRoutes);

// Product routes
mainRoutes.use('/product', productRoutes);

// Order routes
mainRoutes.use('/order', orderRoutes);

// Admin routes (User management/Low stock/All orders)
mainRoutes.use('/admin', adminRoutes);

export default mainRoutes;