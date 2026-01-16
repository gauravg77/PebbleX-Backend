import  { Router } from "express";

import {
  getAllUsers,
  toggleUserStatus,
  getAllOrders,
  getLowStockProducts
} from "../controllers/adminController.js";



const adminRoutes = Router();


adminRoutes.get("/users", getAllUsers);
adminRoutes.patch("/users/:id/toggle-status", toggleUserStatus);
adminRoutes.get("/orders", getAllOrders);
adminRoutes.get("/low-stock", getLowStockProducts);
adminRoutes.get("/products/low-stock", getLowStockProducts);

export default adminRoutes;
