import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0 },
    category: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    image: { type: String, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);