import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export const getSupplierReports = async (req, res) => {
  try {
    const supplierId = new mongoose.Types.ObjectId(req.user._id);

    // ==========================================
    // 1. TOP METRICS (Revenue, Orders, Average)
    // ==========================================
    const statsData = await Order.aggregate([
      {
        $match: {
          supplier: supplierId,
          status: { $in: ["approved", "shipped"] }
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$productDetails.price"] }
          },
          orderIds: { $addToSet: "$_id" }
        }
      }
    ]);

    const stats = statsData[0] || { totalRevenue: 0, orderIds: [] };
    const totalOrders = stats.orderIds.length;
    const avgOrderValue = totalOrders === 0 ? 0 : stats.totalRevenue / totalOrders;

    // ==========================================
    // 2. PENDING ORDERS COUNT
    // ==========================================
    const pendingOrders = await Order.countDocuments({
      supplier: supplierId,
      status: "pending"
    });

    // ==========================================
    // 3. DAILY SALES REVENUE (FOR BAR CHART)
    // ==========================================
    const dailySales = await Order.aggregate([
      {
        $match: {
          supplier: supplierId,
          status: "shipped"
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$product.price"] }
          }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // ==========================================
    // 4. SALES BY CATEGORY (FOR PIE CHART)
    // ==========================================
    const salesByCategory = await Order.aggregate([
      {
        $match: {
          supplier: supplierId,
          status: "shipped"
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$product.price"] }
          }
        }
      }
    ]);

    // ==========================================
    // 5. FINAL RESPONSE
    // ==========================================
    res.json({
      cards: {
        totalRevenue: stats.totalRevenue,
        totalOrders,
        avgOrderValue,
        pendingOrders
      },
      charts: {
        dailySales,
        salesByCategory
      }
    });
  } catch (error) {
    console.error("Reports Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};