import Order from "../models/order.js";
import Product from "../models/product.js";

export const placeOrder = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can place orders" });
    }

    const { supplier, items } = req.body;

    const order = await Order.create({
      vendor: req.user._id,
      supplier,
      items
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
