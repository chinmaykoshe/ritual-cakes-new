const express = require('express');
const router = express.Router(); 
const ensureAuthenticated = require('./Middlewares/auth');
const UserModel = require('../Models/User'); 

router.get('/cart', ensureAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cartItems = user.cartProducts; 
        return res.status(200).json({ cartItems }); 
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ message: 'Error fetching cart items', error });
    }
});

router.post('/cart/add', ensureAuthenticated, async (req, res) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of products' });
    }
    try {
        const user = await UserModel.findById(req.user._id); 
        console.log("User fetched for cart update:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        for (let product of products) {
            const { orderID, name, weight, shape, img, quantity, price } = product;
            console.log("Processing product:", product);
            if (!orderID || !name || !weight || !shape || !img || !quantity || !price) {
                console.log("Missing fields in product:", product);
                return res.status(400).json({ message: 'Missing required fields for product' });
            }
            const cartItem = {
                orderID,
                name,
                weight,
                shape,
                img,
                quantity,
                price,
            };
            const existingProductIndex = user.cartProducts.findIndex(
                (item) => item.orderID === orderID
            );
            if (existingProductIndex !== -1) {
                console.log("Product already in cart, updating quantity");
                user.cartProducts[existingProductIndex].quantity += quantity;
            } else {
                console.log("Adding new product to cart");
                user.cartProducts.push(cartItem);
            }
        }
        await user.save();
        console.log("User cart saved successfully");
        return res.status(200).json({ message: 'Products added to cart successfully' });
    } catch (error) {
        console.error("Error adding products to cart:", error);
        return res.status(500).json({ message: 'Error adding products to cart' });
    }
});

router.post('/cart/update', ensureAuthenticated, async (req, res) => {
    console.log("POST /cart/update - Updating cart item quantity");
    const { orderID, quantity } = req.body; 
    console.log("Request body:", req.body);
    if (!orderID || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const user = await UserModel.findById(req.user._id);
        console.log("User fetched for cart update:", user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const cartItemIndex = user.cartProducts.findIndex(item => item.orderID === orderID);
        if (cartItemIndex === -1) {
            console.log("Product not found in cart:", orderID);
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        console.log("Updating product quantity:", quantity);
        user.cartProducts[cartItemIndex].quantity = quantity;
        await user.save();
        console.log("Cart updated successfully");
        return res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: 'Error updating cart' });
    }
});

router.delete('/cart/remove/:orderID', ensureAuthenticated, async (req, res) => {
    const { orderID } = req.params;
    if (!orderID) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.cartProducts = user.cartProducts.filter(item => item.orderID !== orderID);
        await user.save();
        return res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing product from cart' });
    }
});


module.exports = router;
