import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

// Create a context for Orders
const OrderContext = createContext();

// Create a provider component for Orders
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(false); // State to manage loading status
  const isFetching = useRef(false); // Ref to prevent multiple fetch requests simultaneously

  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch orders for the user when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (isFetching.current) return; // Avoid redundant API calls
      isFetching.current = true; // Mark as fetching

      setLoading(true); // Set loading to true during data fetch
      try {
        const userEmail = localStorage.getItem('user'); // Get user email from localStorage

        if (!token || !userEmail) {
          throw new Error('Missing authentication details'); // Throw error if missing token or user email
        }

        // Fetch orders from API with user email and token
        const response = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/api/orders/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data); // Update orders state with fetched data
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders'); // Handle fetch errors
      } finally {
        setLoading(false); // Set loading to false after the request
        isFetching.current = false; // Reset fetching flag
      }
    };

    fetchOrders(); // Call the function to fetch orders on mount
  }, []); // Empty dependency array means this runs only once on component mount

  // Function to create a new order
  const createOrder = async (orderData) => {
    setLoading(true); // Set loading state to true during order creation
    try {
      if (!token) {
        setError('Token not found.'); // Error if token is missing
        setLoading(false);
        return;
      }
      // Send POST request to create a new order
      const response = await axios.post(`https://ritual-cakes-new-ogk5.vercel.app/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      setOrders((prevOrders) => [...prevOrders, response.data.order]); // Add the new order to the orders list
    } catch (error) {
      setError(error.message || 'Failed to create order'); // Handle errors during order creation
    } finally {
      setLoading(false); // Set loading to false after order creation
    }
  };

  // Function to delete an order
  const deleteOrder = async (orderID) => {
    setLoading(true); // Set loading state to true during order deletion
    try {
      // Send DELETE request to remove an order
      await axios.delete(`https://ritual-cakes-new-ogk5.vercel.app/api/orders/${orderID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted order from the state
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderID));
    } catch (error) {
      setError(error.message || 'Failed to delete order'); // Handle errors during order deletion
    } finally {
      setLoading(false); // Set loading to false after deletion
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders, // Provide orders state
        createOrder, // Provide function to create orders
        deleteOrder, // Provide function to delete orders
        error, // Provide error state
        loading, // Provide loading state
      }}
    >
      {children} {/* Render the child components */}
    </OrderContext.Provider>
  );
};

// Hook to access the Order context
export const useOrder = () => useContext(OrderContext); // Use the Order context for accessing state and functions
