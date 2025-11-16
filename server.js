const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// Before: const connectDB = require("./src/config/db");
const dbModule = require("./src/config/db");
console.log('db module export:', dbModule);
const { connectDB } = dbModule;
const { notFound, errorHandler } = require("./src/middleware/errorMiddleware"); // <-- Import added

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// Routes
const authRoutes = require("./src/routes/userRoutes");
app.use("/api/auth", authRoutes);
// **********************************************************
// ERROR MIDDLEWARE (MUST be placed after routes) <-- Added Error Middleware
app.use(notFound);
app.use(errorHandler);
// **********************************************************

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
