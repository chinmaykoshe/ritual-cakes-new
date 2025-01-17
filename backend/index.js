const express = require('express');
require('dotenv').config();
require('./Models/db'); // Assuming this connects to your database

// Import routers
const AuthRouter = require('./Routes/AuthRouter');
const CartRouter = require('./Routes/CartRouter');
const orderRoutes = require('./Routes/orderRoutes');
const customizeRoutes = require('./Routes/customizeRoutes');
const userRoutes = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRouter');

const app = express();

// CORS configuration
const allowedOrigins = ["https://ritual-cakes--alpha.vercel.app",
 "http://localhost:5174","https://ritualcakes.netlify.app","https://vercel.com/chinmaykoshes-projects/ritual-cakes-"];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
    res.json({ message: "CORS headers are working!" });
});

// Register routes
app.use('/api', userRoutes);          // User routes
app.use('/auth', AuthRouter);         // Authentication routes
app.use('/api/cart', CartRouter);     // Cart routes
app.use('/api/orders', orderRoutes);  // Order routes
app.use('/api', customizeRoutes);     // Customization routes
app.use("/api/reviews", reviewRouter);// Review routes

// Handle favicon requests to prevent unnecessary errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
