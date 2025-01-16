const express = require('express');
require('dotenv').config();
require('./Models/db'); // Assuming this connects to your database
const AuthRouter = require('./Routes/AuthRouter');
const CartRouter = require('./Routes/CartRouter');
const orderRoutes = require('./Routes/orderRoutes');
const customizeRoutes = require('./Routes/customizeRoutes');
const userRoutes = require('./Routes/userRoutes');
const reviewRouter = require("./Routes/reviewRouter");



// CORS configuration with direct allowed origin
app.use((req, res, next) => {
    const allowedOrigin ="https://ritualcakes.netlify.app";
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }
    next();
});

// Parse JSON bodies
app.use(express.json());

// Root route for testin
app.get("/", (req, res) => {
    res.json({
        message: "CORS headers are working!",
    });
});

// Register routes
app.use('/api', userRoutes);  // User routes
app.use('/auth', AuthRouter);  // Authentication routes
app.use('/api/cart', CartRouter);  // Cart routes
app.use('/api/orders', orderRoutes);  // Order routes
app.use('/api', customizeRoutes);  // Customization routes
app.use("/api/reviews", reviewRouter);  // Review routes

module.exports = app;
