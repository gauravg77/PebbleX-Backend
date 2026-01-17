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
import { upload } from '../config/cloudinary.js';

// --- Protected Routes (Supplier/Admin) ---

// POST: Add new product with up to 5 images
router.post('/', protect, upload.array('images', 5), addProduct);

// PUT: Update product (allows updating images too)
router.put('/:id', protect, upload.array('images', 5), updateProduct);

// DELETE: Remove product
router.delete('/:id', protect, deleteProduct);

// GET: Supplier specific low stock alerts
router.get("/low-stock", protect, getLowStockProducts);


// --- Public Routes ---

// GET: Product by ID
router.get('/:id', getProductById);

// GET: All products
router.get('/', getProducts);

export default router;