import express from "express";
import { getSupplierReports } from "../controllers/supplierController.js";
import { protect } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * SUPPLIER → Reports & Analytics
 */
router.get(
  "/reports",
  protect,
  roleMiddleware("supplier"),
  getSupplierReports
);

export default router;
