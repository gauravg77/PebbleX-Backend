import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * VENDOR → Place a new order
 */
export const placeOrder = async (req, res) => {
  try {
    // Fix: Match uppercase role from User Model
    if (req.user.role !== "VENDOR") {
      return res.status(403).json({ message: "Only vendors can place orders" });
    }

    const { supplier, items } = req.body;

    const order = await Order.create({
      vendor: req.user._id,
      supplier,
      items
    });

    res.status(201).json({ order, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VENDOR → View own orders
 */
export const getVendorOrders = async (req, res) => {
  try {
    const query = { vendor: req.user._id };

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price")
      .populate("supplier", "name email") // Updated field name
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUPPLIER → View received orders
 */
export const getSupplierOrders = async (req, res) => {
  try {
    const query = { supplier: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const orders = await Order.find(query)
      .populate("items.product", "name price")
      .populate("vendor", "name email") // Updated field name
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUPPLIER → Approve order
 */
export const approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fix: Using _id.toString() for safety
    if (order.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "approved";
    await order.save();

    res.json({ message: "Order approved", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUPPLIER → Reject order
 */
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = "rejected";
    await order.save();

    res.json({ message: "Order rejected", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUPPLIER → Ships order (Reduces Stock)
 */
export const shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "approved") {
      return res.status(400).json({ message: "Order must be approved before shipping" });
    }

    // Reduce stock
    for (const item of order.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.product.name} no longer exists` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`
        });
      }

      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();

      // LOW STOCK ALERT
      if (product.stock <= product.lowStockThreshold) {
        console.log(`LOW STOCK ALERT: ${product.name} (${product.stock} left)`);
      }
    }

    order.status = "shipped";
    await order.save();

    res.json({
      message: "Order shipped and stock updated",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VENDOR → Cancel order
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only vendor who placed order can cancel
    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};