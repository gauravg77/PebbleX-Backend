import express from 'express';
const router = express.Router();

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductById,
  searchProducts
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

// --- SEARCH & ANALYTICS ---
// Place /search before /:id to avoid path conflicts
router.get("/search", searchProducts);
router.get("/low-stock", protect, getLowStockProducts);

// --- MUTATION ROUTES ---
router.post('/', protect, upload.array('images', 5), addProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

// --- FETCH ROUTES ---
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;