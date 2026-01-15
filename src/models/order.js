import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "shipped"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
