import express from 'express';
const app = express();

import { config } from 'dotenv';
config();
const port = process.env.PORT || 5000;
import  { connecttoMongoDB } from './connect.js';


import userRoutes from './src/routes/userRoutes.js';


app.use(express.json());




// Routes
app.use('/api/v1', userRoutes);


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