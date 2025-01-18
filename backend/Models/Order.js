const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: true, 
        index: true,
        set: (email) => email.toLowerCase() // Automatically convert to lowercase
    },
    orderItems: [
        {
            orderID: { type: String, required: true },
            name: { type: String, required: true },
            shape: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
            weight: { type: String, required: true },
            image: { type: String, required: true }, // Field for image URL or path
        },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { 
        type: String, 
        enum: ['COD', 'Online'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Cancelled'], 
        default: 'Pending' 
    },
    createdAt: { type: Date, default: Date.now },
    cakeMessage: { type: String, required: true, maxlength: 100 },
    orderDate: { type: Date, required: true },
    orderTime: { type: String, required: true },  // Field for time of the order
});

const Order = mongoose.models.orders || mongoose.model('orders', OrderSchema);

module.exports = Order;
