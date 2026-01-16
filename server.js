import express from 'express';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from "./src/routes/orderRoutes.js";
import userRoutes from './src/routes/userRoutes.js';
import  { connecttoMongoDB } from './connect.js';
import { config } from 'dotenv';
import adminRoutes from './src/routes/adminRoutes.js';


const app = express();
const port = process.env.PORT || 5000;

config();

// Routes
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use('/api/v1', userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);



// MongoDB connection
connecttoMongoDB(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});