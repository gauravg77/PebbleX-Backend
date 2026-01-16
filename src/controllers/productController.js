import Product from '../models/product.js';

export const addProduct = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ message: 'Only suppliers can add products' });
    }

    const product = await Product.create({
      supplier: req.user._id,
      ...req.body
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProducts = async (req, res) => {
  const products = await Product.find().populate('supplier', 'name');
  res.json(products);
};


export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.supplier.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your product' });
  }

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
};


export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.supplier.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted' });
};


export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      supplier: req.user.id,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }).sort({ stock: 1 });

    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
