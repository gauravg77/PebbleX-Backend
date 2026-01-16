import express from "express";
import {
  placeOrder,
  getVendorOrders,
  getSupplierOrders,
  approveOrder,
  rejectOrder,
  shipOrder,
  cancelOrder
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * Vendor places order
 */
router.post("/", protect, roleMiddleware("VENDOR"), placeOrder);

/**
 * Vendor views own orders
 */
router.get(
  "/vendor",
  protect,
  roleMiddleware("VENDOR"),
  getVendorOrders
);

/**
 * Supplier views received orders
 */
router.get(
  "/supplier",
  protect,
  roleMiddleware("SUPPLIER"),
  getSupplierOrders
);

/**
 * Supplier approves order
 */
router.patch(
  "/:orderId/approve",
  protect,
  roleMiddleware("SUPPLIER"),
  approveOrder
);

/**
 * Supplier rejects order
 */
router.patch(
  "/:orderId/reject",
  protect,
  roleMiddleware("SUPPLIER"),
  rejectOrder
);

/**
 * Supplier ships order
 */
router.patch(
  "/:orderId/ship",
  protect,
  roleMiddleware("SUPPLIER"),
  shipOrder
);
// Vendor cancels order
router.put("/:orderId/cancel", protect, cancelOrder);


export default router;
