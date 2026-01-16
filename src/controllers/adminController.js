import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * ADMIN → Get all users
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({
    success: true,
    users,
    message: "Users fetched successfully"
  });
};

/**
 * ADMIN → Block / Unblock user
 */
export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: "User not found"
     });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${user.isActive ? "unblocked" : "blocked"}`,
    user
  });
};

/**
 * ADMIN → View all orders
 */
export const getAllOrders = async (reqz, res) => {
  const orders = await Order.find()
    .populate("vendor supplier", "name email")
    .populate("items.product", "name price");

  res.json({
    success: true,
    orders,
    message: "Orders fetched successfully"
  });
};

/**
 * ADMIN → Low stock products
 */
export const getLowStockProducts = async (req, res) => {
  const products = await Product.find({ stock: { $lte: 5 } });
  res.json({
    success: true,
    products,
    message: "Low stock products fetched successfully"
  });
};
