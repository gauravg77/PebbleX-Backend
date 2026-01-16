import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

/**
 * ADMIN → Get all users
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

/**
 * ADMIN → Block / Unblock user
 */
export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    message: `User ${user.isActive ? "unblocked" : "blocked"}`,
    user
  });
};

/**
 * ADMIN → View all orders
 */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("vendor supplier", "name email")
    .populate("items.product", "name price");

  res.json(orders);
};

/**
 * ADMIN → Low stock products
 */
export const getLowStockProducts = async (req, res) => {
  const products = await Product.find({ stock: { $lte: 5 } });
  res.json(products);
};
