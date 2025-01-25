import React, { useState, useEffect } from 'react';
import { elements } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cakes = Object.values(elements).flat();

function Store() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [customMessages, setCustomMessages] = useState({}); // For storing custom messages for each cake

  useEffect(() => {
    const defaultOptions = cakes.reduce((acc, cake) => {
      const defaultWeight = cake.prices['500g'] ? '500g' : Object.keys(cake.prices)[0];
      acc[cake.orderID] = { weight: defaultWeight, shape: 'round' };
      return acc;
    }, {});
    setSelectedOptions(defaultOptions);
  }, []);

  const handleSelectionChange = (orderID, type, value) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [orderID]: {
        ...prevState[orderID],
        [type]: value,
      },
    }));
  };

  const handleCustomMessageChange = (orderID, message) => {
    setCustomMessages((prevState) => ({
      ...prevState,
      [orderID]: message,
    }));
  };


  const token = localStorage.getItem('token');

  const placeOrder = async (selectedCake) => {
    try {
      // Fetch user details and token from local storage
      const userEmail = localStorage.getItem('user') || 'ritualcake.admin@gmail.com'; // Replace with dynamic user retrieval
      if (!token) {
        toast.error('Token is missing. Please log in.');
        throw new Error('Authentication token is missing.');
      }

      // Validate the selected options (weight and shape)
      const selectedOption = selectedOptions[selectedCake.orderID];
      if (!selectedOption?.weight || !selectedOption?.shape) {
        toast.error('Please select a valid weight and shape.');
        return;
      }

      // Prepare the order item data
      const orderItem = {
        name: selectedCake.name,
        weight: selectedOption.weight,
        shape: selectedOption.shape,
        price: selectedCake.prices[selectedOption.weight] || 'N/A',
        orderID: selectedCake.orderID,
        image: selectedCake.image || 'default_image_url',
      };

      // Calculate total amount from price
      const totalAmount = parseFloat(orderItem.price || 0);
      if (isNaN(totalAmount) || totalAmount <= 0) {
        toast.error('Invalid total amount. Please check the price and try again.');
        return;
      }

      // Static or dynamic values
      const deliveryAddress = '123 Main St'; // Replace with the user's actual address if available
      const paymentMethod = 'COD'; // Replace with dynamic value if needed
      const cakeMessage = customMessages[selectedCake.orderID]?.trim() || 'Ordered from store';
      const apiUrl = 'https://ritual-cakes-new-ogk5.vercel.app/api'

      // Validate custom message length
      if (cakeMessage.length > 100) {
        toast.error('Custom message must be 100 characters or less.');
        return;
      }

      // Prepare the order data payload
      const orderData = {
        userEmail,
        orderItems: [orderItem],
        totalAmount,
        deliveryAddress,
        paymentMethod,
        cakeMessage,
        orderDate: new Date().toISOString(),
        orderTime: new Date().toLocaleTimeString(),
      };

      // Send the order data to the backend API
      const response = await axios.post(
        `${apiUrl}/orders`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(`Order for "${selectedCake.name}" placed successfully!`);
      } else {
        throw new Error('Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      toast.error('Error placing order: ' + (error.response?.data?.message || error.message));
    }
  };

  // Confirmation before placing the order
  const handlePlaceOrder = (cake) => {
    const confirmation = window.confirm(
      `Are you sure you want to place an order for "${cake.name}" (${selectedOptions[cake.orderID]?.weight}, ${selectedOptions[cake.orderID]?.shape})?`
    );
    if (confirmation) {
      placeOrder(cake);
    }
  };



  const filteredCakes = cakes.filter((cake) =>
    cake.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">Store</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for cakes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Weight</th>
            <th className="border border-gray-300 px-4 py-2">Selected Price</th>
            <th className="border border-gray-300 px-4 py-2">Shape</th>
            <th className="border border-gray-300 px-4 py-2">Contact</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCakes.map((cake) => (
            <tr key={cake.orderID}>
              <td className="border border-gray-300 px-4 py-2">{cake.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  className="border p-2"
                  onChange={(e) => handleSelectionChange(cake.orderID, 'weight', e.target.value)}
                  value={selectedOptions[cake.orderID]?.weight || ''}
                >
                  {Object.keys(cake.prices).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {selectedOptions[cake.orderID]?.weight
                  ? cake.prices[selectedOptions[cake.orderID].weight]
                  : 'Select a weight'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  className="border p-2"
                  onChange={(e) => handleSelectionChange(cake.orderID, 'shape', e.target.value)}
                  value={selectedOptions[cake.orderID]?.shape || 'round'}
                >
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="heart">Heart</option>
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  className="border p-2 w-full"
                  value={customMessages[cake.orderID] || ''}
                  onChange={(e) => handleCustomMessageChange(cake.orderID, e.target.value)}
                  placeholder="Enter mobile number (optional)"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handlePlaceOrder(cake)}
                >
                  Place Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Store;