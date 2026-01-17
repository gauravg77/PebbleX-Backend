import express from 'express';
const router = express.Router();
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductById
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';

// Supplier/Admin only - protected
router.post('/', protect, addProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

// Supplier - get low stock products
router.get("/low-stock", protect, getLowStockProducts);

// Product by ID
router.get('/:id', getProductById);

// Public - get all products
router.get('/', getProducts);

export default router;
