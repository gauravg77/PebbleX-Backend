import express from 'express';
import  { connecttoMongoDB } from './connect.js';
import { config } from 'dotenv';
import mainRoutes from './src/routes/mainRoutes.js';
import cors from 'cors';

const app = express();

config();
const port = process.env.PORT  || 3000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}));

// Routes
app.use(express.json());
app.use("/api/v1",mainRoutes);
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
