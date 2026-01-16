import  { Router } from 'express';
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';

const productRoutes = Router();
// Supplier/Admin only - protected
productRoutes.post('/', protect, addProduct);
productRoutes.put('/:id', protect, updateProduct);
productRoutes.delete('/:id', protect, deleteProduct);

// Public - get all products
productRoutes.get('/', getProducts);

// Supplier - get low stock products
productRoutes.get("/low-stock", protect, getLowStockProducts);

export default productRoutes;
