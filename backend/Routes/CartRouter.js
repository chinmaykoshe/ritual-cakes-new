const express = require('express');
const router = express.Router(); // Initialize the Router
const ensureAuthenticated = require('./Middlewares/auth');


const UserModel = require('../Models/User'); // Ensure you have the correct User model imported

// Example Product for testing - This can be removed in production
const exampleProduct = {
    orderID: '12345', // Example product ID
    name: 'Chocolate Cake',
    weight: '500g',
    shape: 'Round',
    img: 'https://example.com/chocolate-cake.jpg', // Example image URL
    quantity: 1,
    price: 20 // Example price for one unit
};

// GET Route to fetch cart items for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
    console.log("GET /api/cart - Fetching cart items");
    try {
        // Fetch the user by their ID using the user ID from the authenticated session (req.user._id)
        const user = await UserModel.findById(req.user._id); 
        console.log("User fetched:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cartItems = user.cartProducts; // Retrieve the cart items from the user document
        console.log("Cart items retrieved:", cartItems);
        
        // Return both cartItems and the exampleProduct for testing purposes (you might want to remove exampleProduct in production)
        return res.status(200).json({ cartItems, exampleProduct }); 
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ message: 'Error fetching cart items' });
    }
});

// POST Route to add multiple items to the cart
router.post('/add', ensureAuthenticated, async (req, res) => {
    console.log("POST /api/cart/add - Adding products to cart");
    const { products } = req.body; // Get products from the request body (array of product details)

    console.log("Products received:", products);

    // Check if products is an array and has at least one product
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Please provide an array of products' });
    }

    try {
        const user = await UserModel.findById(req.user._id); // Get the authenticated user from the database
        console.log("User fetched for cart update:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Iterate through each product and either update or add to the cart
        for (let product of products) {
            const { orderID, name, weight, shape, img, quantity, price } = product;

            console.log("Processing product:", product);

            // Validate that all required fields are provided for each product
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

            // Check if the product already exists in the cart by orderID
            const existingProductIndex = user.cartProducts.findIndex(
                (item) => item.orderID === orderID
            );

            if (existingProductIndex !== -1) {
                // Update quantity if product already exists
                console.log("Product already in cart, updating quantity");
                user.cartProducts[existingProductIndex].quantity += quantity;
            } else {
                // Add new product to cart if not found
                console.log("Adding new product to cart");
                user.cartProducts.push(cartItem);
            }
        }

        await user.save(); // Save the updated user cart to the database
        console.log("User cart saved successfully");
        return res.status(200).json({ message: 'Products added to cart successfully' });
    } catch (error) {
        console.error("Error adding products to cart:", error);
        return res.status(500).json({ message: 'Error adding products to cart' });
    }
});

// POST Route to update the quantity of a cart item
router.post('/update', ensureAuthenticated, async (req, res) => {
    console.log("POST /api/cart/update - Updating cart item quantity");
    const { orderID, quantity } = req.body; // Get the orderID and new quantity from the request body

    console.log("Request body:", req.body);

    // Check if both orderID and quantity are provided
    if (!orderID || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await UserModel.findById(req.user._id); // Get the user from the database
        console.log("User fetched for cart update:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the cart item with the matching orderID
        const cartItemIndex = user.cartProducts.findIndex(item => item.orderID === orderID);
        
        if (cartItemIndex === -1) {
            console.log("Product not found in cart:", orderID);
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the quantity of the cart item
        console.log("Updating product quantity:", quantity);
        user.cartProducts[cartItemIndex].quantity = quantity;

        await user.save(); // Save the updated user cart
        console.log("Cart updated successfully");
        return res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: 'Error updating cart' });
    }
});
router.delete('/remove/:orderID', ensureAuthenticated, async (req, res) => {
    const { orderID } = req.params;
    if (!orderID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the product from the cart using the orderID
      user.cartProducts = user.cartProducts.filter(item => item.orderID !== orderID);
  
      await user.save();
      return res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
      return res.status(500).json({ message: 'Error removing product from cart' });
    }
  });
  

module.exports = router;



