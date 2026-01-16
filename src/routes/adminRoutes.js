import express from "express";

import {
  getAllUsers,
  toggleUserStatus,
  getAllOrders,
  getLowStockProducts
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.get("/orders", getAllOrders);
router.get("/low-stock", getLowStockProducts);
router.get("/products/low-stock", getLowStockProducts);

export default router;
