import React, { useState, useEffect } from 'react';
import { elements } from '../../assets/assets';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cakes = Object.values(elements).flat();

function Store() {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

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

  const placeOrder = async (selectedCake) => {
    try {
      const userEmail = 'ritualcake.admin@gmail.com';
      const selectedOption = selectedOptions[selectedCake.orderID];

      const orderItem = {
        name: selectedCake.name,
        weight: selectedOption?.weight,
        shape: selectedOption?.shape,
        price: selectedCake.prices[selectedOption?.weight] || 'N/A',
        orderID: selectedCake.orderID,
        image: selectedCake.image || 'default_image_url',
      };

      console.log('Order Item:', orderItem);

      const totalAmount = parseFloat(orderItem.price || 0);
      const deliveryAddress = '123 Main St';
      const paymentMethod = 'COD';
      const cakeMessage = 'Ordered from store';

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

      console.log('Order Data:', orderData);

      // Retrieve the token from localStorage or wherever it is stored
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token is missing. Please log in.");
      }

      // Send the POST request with the Authorization header
      const response = await axios.post(
        'https://ritual-cakes-new-ogk5.vercel.app/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the bearer token here
          },
        }
      );

      if (response.status === 201) {
        const successMessage = `Order for "${selectedCake.name}" placed successfully!`;
        toast.success(successMessage);
      } else {
        const errorMessage = 'Failed to place order.';
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to place order.';
      toast.error(errorMessage);
      console.error('Error placing order:', errorMessage);
    }
  };

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
