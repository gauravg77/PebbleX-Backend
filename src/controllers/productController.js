import Product from '../models/product.js';

// @desc    Add a new product (with multiple images)
export const addProduct = async (req, res) => {
  try {
    if (req.user.role !== 'SUPPLIER') {
      return res.status(403).json({ success: false, message: 'Only suppliers can add products' });
    }

    // Capture multiple image paths from Cloudinary/Multer
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      ...req.body,
      supplier: req.user._id,
      images: imageUrls // Matches the array field in your schema
    });

    res.status(201).json({ 
      success: true, 
      message: 'Product added successfully', 
      product 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('supplier', 'name');
    res.json({ 
      success: true, 
      count: products.length, 
      products 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name email');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Invalid ID format' });
  }
};

// @desc    Update product (Ownership check + Image support)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Admin or Owner check
    const isOwner = product.supplier.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      //Replace all images
      req.body.images = newImages; 
      
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete product (Admin or Owner)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const isOwner = product.supplier.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get low stock items (Supplier see their own, Admin sees all)
export const getLowStockProducts = async (req, res) => {
  try {
    // 1. Role Check: Only SUPPLIER or ADMIN allowed
    const allowedRoles = ['SUPPLIER', 'ADMIN'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied.' 
      });
    }

    // 2. Build Query: If Supplier, filter by their ID. If Admin, empty filter (see all).
    let query = { $expr: { $lte: ["$stock", "$lowStockThreshold"] } };
    
    if (req.user.role === 'SUPPLIER') {
      query.supplier = req.user._id;
    }

    // 3. Execute Query
    const products = await Product.find(query)
      .populate('supplier', 'name email')
      .sort({ stock: 1 });

    res.json({
      success: true,
      message: req.user.role === 'ADMIN' ? 'Admin view: All low stock items' : 'Supplier view: Your low stock items',
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // ==========================================
    // 1. SEARCH LOGIC (Regex for Autofill)
    // ==========================================
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // "i" makes it case-insensitive
    })
      .select("name _id price category images") // Only return necessary fields for speed
      .limit(10); // Limit results for better performance

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};