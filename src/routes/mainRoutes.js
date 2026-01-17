import { Router } from "express";
import authRoutes from "./userRoutes.js";
import orderRoutes from "./orderRoutes.js";
import productRoutes from "./productRoutes.js";
import adminRoutes from "./adminRoutes.js"; // Added to include your admin features
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import supplierRoutes from "./supplierRoutes.js";
const mainRoutes = Router();

// Auth routes (Register/Login/Profile)
mainRoutes.use('/auth', authRoutes);

// Product routes
mainRoutes.use('/product', productRoutes);

// Order routes
mainRoutes.use('/order', orderRoutes);

// Admin routes (User management/Low stock/All orders)
mainRoutes.use('/admin',protect,adminOnly, adminRoutes);

mainRoutes.use('/supplier', supplierRoutes);
export default mainRoutes;