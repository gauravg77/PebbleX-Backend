import express from "express";
import {
  placeOrder,
  getVendorOrders,
  getSupplierOrders,
  approveOrder,
  rejectOrder,
  shipOrder
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Vendor places order
 */
router.post("/", protect, roleMiddleware("vendor"), placeOrder);

/**
 * Vendor views own orders
 */
router.get(
  "/vendor",
  protect,
  roleMiddleware("vendor"),
  getVendorOrders
);

/**
 * Supplier views received orders
 */
router.get(
  "/supplier",
  protect,
  roleMiddleware("supplier"),
  getSupplierOrders
);

/**
 * Supplier approves order
 */
router.patch(
  "/:orderId/approve",
  protect,
  roleMiddleware("supplier"),
  approveOrder
);

/**
 * Supplier rejects order
 */
router.patch(
  "/:orderId/reject",
  protect,
  roleMiddleware("supplier"),
  rejectOrder
);

/**
 * Supplier ships order
 */
router.patch(
  "/:orderId/ship",
  protect,
  roleMiddleware("supplier"),
  shipOrder
);

export default router;
