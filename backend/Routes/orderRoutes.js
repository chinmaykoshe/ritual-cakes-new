const express = require('express');
const router = express.Router();
const OrderModel = require('../Models/Order'); // Import the Order model


// Get all orders (Admin only)
router.get('/api/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }); // Fetch all orders sorted by newest
    res.status(200).json(orders); // Return the orders
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});


// Add a route to fetch all orders for admin
router.get('/api/orders/all', async (req, res) => {
  try {
    // Only allow access to admins (you can add your authorization logic here)
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
});



// Middleware to fetch orders based on userEmail
const getUserOrders = async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const orders = await OrderModel.find({ userEmail }).sort({ createdAt: -1 }); // Sort by newest first
    req.userOrders = orders;
    next();
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Create a new order
router.post('/api/orders', async (req, res) => {
  try {
    const {
      userEmail,
      orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      cakeMessage,
      orderDate,
      orderTime
      
    } = req.body;

    // Validation for required fields
    if (!userEmail || !orderItems || !totalAmount || !deliveryAddress || !paymentMethod || !orderDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if paymentMethod is valid
    const validPaymentMethods = ['COD', 'Online'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Validate cakeMessage length
    if (cakeMessage && cakeMessage.length > 100) {
      return res.status(400).json({ message: 'Cake message must be 100 characters or less' });
    }

    // Create the new order
    const newOrder = new OrderModel({
      userEmail,
      orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      cakeMessage,
      orderDate,
      orderTime,
      status: 'Pending', // Default status
      createdAt: new Date(), // Current date/time
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all orders for a user (uses middleware for dynamic updates)
router.get('/api/orders/:userEmail', getUserOrders, (req, res) => {
  res.status(200).json(req.userOrders);
});

// Update tracking info for an order
router.put('/api/orders/:orderID/tracking', async (req, res) => {
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
    console.error('Error updating tracking info:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete an order by ID
router.delete('/api/orders/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;

    // Find and delete the order by ID
    const deletedOrder = await OrderModel.findByIdAndDelete(orderID);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully', orderID });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


// Update order status
router.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the order's status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


module.exports = router;
