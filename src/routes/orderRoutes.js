import express from "express";
import {
  placeOrder,
  getVendorOrders,
  getSupplierOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Vendor places order
router.post("/", protect, placeOrder);

// Vendor views orders
router.get("/vendor", protect, getVendorOrders);

// Supplier views orders
router.get("/supplier", protect, getSupplierOrders);

// Supplier updates order status
router.put("/:orderId/status", protect, updateOrderStatus);

export default router;
