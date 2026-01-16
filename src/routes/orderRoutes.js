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
import order from "../models/order.js";

const orderRoutes = express.Router();

/**
 * Vendor places order
 */
orderRoutes.post("/", protect, roleMiddleware("vendor"), placeOrder);

/**
 * Vendor views own orders
 */
orderRoutes.get(
  "/vendor",
  protect,
  roleMiddleware("vendor"),
  getVendorOrders
);

/**
 * Supplier views received orders
 */
orderRoutes.get(
  "/supplier",
  protect,
  roleMiddleware("supplier"),
  getSupplierOrders
);

/**
 * Supplier approves order
 */
orderRoutes.patch(
  "/:orderId/approve",
  protect,
  roleMiddleware("supplier"),
  approveOrder
);

/**
 * Supplier rejects order
 */
orderRoutes.patch(
  "/:orderId/reject",
  protect,
  roleMiddleware("supplier"),
  rejectOrder
);

/**
 * Supplier ships order
 */
orderRoutes.patch(
  "/:orderId/ship",
  protect,
  roleMiddleware("supplier"),
  shipOrder
);
// Vendor cancels order
orderRoutes.put("/:orderId/cancel", protect, cancelOrder);


export default orderRoutes;
