const express = require('express');
const router = express.Router();
const OrderModel = require('../Models/Order');
const ensureAuthenticated = require('./Middlewares/auth'); // Import the middleware


// Middleware to fetch orders based on userEmail
const getUserOrders = async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const orders = await OrderModel.find({ userEmail }).sort({ createdAt: -1 });
    req.userOrders = orders;
    next();
  } catch (error) {
    console.error('Error fetching orders for user', req.params.userEmail, error.message);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all orders (Admin only)
router.get('/orders', ensureAuthenticated, async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// Create a new order (Authenticated users)
router.post('/orders', ensureAuthenticated, async (req, res) => {
  try {
    const { userEmail, orderItems, totalAmount, deliveryAddress, paymentMethod, cakeMessage, orderDate, orderTime } = req.body;

    // Validation for required fields
    if (!userEmail || !orderItems || !totalAmount || !deliveryAddress || !paymentMethod || !orderDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validPaymentMethods = ['COD', 'Online'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    if (cakeMessage && cakeMessage.length > 100) {
      return res.status(400).json({ message: 'Cake message must be 100 characters or less' });
    }

    // Normalize userEmail
    const userEmailNormalized = userEmail.toLowerCase();

    const newOrder = new OrderModel({
      userEmail: userEmailNormalized,
      orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      cakeMessage,
      orderDate,
      orderTime,
      status: 'Pending', // Default status
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all orders for a specific user (Authenticated users only)
router.get('/orders/:userEmail', ensureAuthenticated, getUserOrders, (req, res) => {
  // Ensure the user can only see their own orders (case insensitive)
  if (req.user.email.toLowerCase() !== req.params.userEmail.toLowerCase()) {
    return res.status(403).json({ message: 'Access forbidden: You can only view your own orders' });
  }
  res.status(200).json(req.userOrders);
});

// Update tracking info for an order (Admin only)
router.put('/orders/:orderID/tracking', ensureAuthenticated, async (req, res) => {
  try {
    const { orderID } = req.params;
    const { trackingNumber, deliveryStatus } = req.body;

    const validStatuses = ['In Transit', 'Out for Delivery', 'Delivered', 'Delayed', 'Failed'];
    if (deliveryStatus && !validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({ message: 'Invalid delivery status' });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderID,
      {
        $set: {
          'trackingInfo.trackingNumber': trackingNumber,
          'trackingInfo.deliveryStatus': deliveryStatus,
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Tracking info updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete an order by ID (Admin only)
router.delete('/orders/:orderID', ensureAuthenticated, async (req, res) => {
  try {
    const { orderID } = req.params;

    const deletedOrder = await OrderModel.findByIdAndDelete(orderID);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', orderID });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update order status (Admin only)
router.put('/orders/:orderId/status', ensureAuthenticated, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
