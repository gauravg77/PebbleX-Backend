import express from 'express';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from "./src/routes/orderRoutes.js";


const app = express();

import { config } from 'dotenv';
config();
const port = process.env.PORT || 5000;
import  { connecttoMongoDB } from './connect.js';


import userRoutes from './src/routes/userRoutes.js';

// Routes
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use('/api/v1', userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/products", productRoutes);





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