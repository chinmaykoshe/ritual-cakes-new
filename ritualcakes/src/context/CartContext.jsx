import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create context for Cart
const CartContext = createContext();    

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = `https://ritual-cakes-new-ogk5.vercel.app/api/cart`; // Base URL


  const token = localStorage.getItem('token');

  
  // Load cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${apiUrl}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setCart(response.data.cartItems); // Set cart items
      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
      }
    };
    fetchCart();
  }, []); // Runs only once

  // Add product to cart
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/add`, 
        { products: [product] }, 
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      return response.data; // Return added product details
    } catch (error) {
      setSuccessMessage("Failed to add product to cart");
      setTimeout(() => setSuccessMessage(""), 3000); // Reset message after 3s
      return null;
    }
  };

  // Update product quantity
  const updateQuantity = async (orderID, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiUrl}/update`,
        { orderID, quantity },
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setCart((prevCart) => prevCart.map(item => item.orderID === orderID ? { ...item, quantity } : item));
    } catch (error) {
      console.error(error);
    }
  };

  // Remove product from cart
  const removeFromCart = async (orderID) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/remove/${orderID}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setCart((prevCart) => prevCart.filter(item => item.orderID !== orderID));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
