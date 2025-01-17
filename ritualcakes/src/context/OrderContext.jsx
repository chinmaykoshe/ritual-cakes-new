import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

// Create a context for Orders
const OrderContext = createContext();

// Create a provider component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // State to store orders
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(false); // State for loading status
  const isFetching = useRef(false);

  // Fetch orders for the user on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (isFetching.current) return; // Prevent redundant API calls
      isFetching.current = true;

      setLoading(true); // Start loading
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('user');

        if (!token || !userEmail) {
          throw new Error('Missing authentication details');
        }

        const response = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/orders/${userEmail}`, {
          headers: { Authorization: `${token}` },
        });

        setOrders(response.data); // Set the fetched orders
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false); // End loading
        isFetching.current = false; // Reset fetching flag
      }
    };

    fetchOrders();
  }, []); // Runs once on component mount

  // Function to create a new order
  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found.');
        setLoading(false);
        return;
      }
      const response = await axios.post(`https://ritual-cakes-new-ogk5.vercel.app/orders`, orderData, {
        headers: { Authorization: `${token}`, 'Content-Type': 'application/json' },
      });

      setOrders((prevOrders) => [...prevOrders, response.data.order]);
    } catch (error) {
      setError(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an order
  const deleteOrder = async (orderID) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://ritual-cakes-new-ogk5.vercel.app/orders/${orderID}`, {
        headers: { Authorization: `${token}` },
      });

      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderID));
    } catch (error) {
      setError(error.message || 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        deleteOrder,
        error,
        loading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook to use Order context
export const useOrder = () => useContext(OrderContext);
