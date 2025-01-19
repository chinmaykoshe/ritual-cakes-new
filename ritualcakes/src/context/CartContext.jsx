import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create a context for Cart
const CartContext = createContext();    

// Create a provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Determine the base URL based on the environment
  const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://ritual-cakes-new-ogk5.vercel.app/api/cart'
    : 'http://localhost:8084/api/cart';

  // Load cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token if needed
        const response = await axios.get(`${apiUrl}`, {  // Use the apiUrl here
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token to request header
          },
        });
        const cartItems = response.data.cartItems; // Assuming 'cartItems' is the key in the response
        setCart(cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
      }
    };

    fetchCart();
    
  }, []); // Empty dependency array ensures this runs only once on mount

// Function to add product to cart
const addToCart = async (product) => {
  try {
    const token = localStorage.getItem('token'); // Fetch the token if needed
    const response = await axios.post(
      `${apiUrl}/add`,  // Use the apiUrl here with the endpoint
      { products: [product] }, // Wrap the single product in an array
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Product added successfully:', response.data);
    return response.data; // Return response to handleAddToCart
  } catch (error) {
    console.error('Error adding product to cart:', error.response?.data || error.message);
    setSuccessMessage("Failed to add product to cart"); // Notify the user of failure
    setTimeout(() => setSuccessMessage(""), 3000); // Clear the message after 3 seconds
    return null;
  }
};

// Function to update product quantity in cart
const updateQuantity = async (orderID, quantity) => {
  try {
    const token = localStorage.getItem('token'); // Fetch the token if needed
    const response = await axios.post(
      `${apiUrl}/update`,  // Use the apiUrl here with the endpoint
      { orderID, quantity },
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token if authentication is required
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Backend response:', response.data);

    // If successful, update the state
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.orderID === orderID ? { ...item, quantity } : item
      );
    });
  } catch (error) {
    console.error('Error updating quantity:', error.response?.data || error.message);
  }
};

// Function to remove product from cart
const removeFromCart = async (orderID) => {
  try {
    const token = localStorage.getItem('token'); // Fetch the token if needed
    const response = await axios.delete(`${apiUrl}/remove/${orderID}`, {  // Use the apiUrl here with the endpoint
      headers: {
        'Authorization': `Bearer ${token}`, // Attach token
      },
    });
    console.log('Product removed successfully:', response.data);

    // Update the local state after successful removal
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.orderID !== orderID);

      // Update localStorage to reflect the change
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      return updatedCart;
    });
  } catch (error) {
    console.error('Error removing product from cart:', error.response?.data || error.message);
  }
};

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
