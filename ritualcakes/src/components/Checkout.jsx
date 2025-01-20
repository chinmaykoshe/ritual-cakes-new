import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";

function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [cakeMessage, setCakeMessage] = useState("Happy Birthday <Name>");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("17:00"); // Default to 5:00 PM
  const [paymentMethod, setPaymentMethod] = useState("COD"); // New state for payment method
  const [errorMessages, setErrorMessages] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { createOrder, error, loading } = useOrder();

  useEffect(() => {
    // Calculate the date 2 days later and set it as the default order date
    const date = new Date();
    date.setDate(date.getDate() + 2); // Set the date to 2 days later
    const formattedDate = date.toISOString().split("T")[0];
    setOrderDate(formattedDate); // Set the default order date to 2 days later

    // Update the min date for the date input (2 days later)
    const minDate = formattedDate;
    
    const orderDateInput = document.getElementById("orderDateInput");
    if (orderDateInput) {
      orderDateInput.setAttribute("min", minDate);
    }
  }, []); // Empty dependency array to run only on component mount

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getUserEmail = () => {
    return localStorage.getItem("user") || null;
  };

  const handleOrderTimeChange = (event) => {
    const selectedTime = event.target.value;
    const selectedDate = new Date(`1970-01-01T${selectedTime}:00`);
    const startTime = new Date("1970-01-01T10:00:00"); // 10:00 AM
    const endTime = new Date("1970-01-01T23:00:00"); // 11:00 PM

    if (selectedDate >= startTime && selectedDate <= endTime) {
      setOrderTime(selectedTime);
    } else {
      setErrorMessages("Please select a time between 10:00 AM and 11:00 PM.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !address || !cakeMessage || !orderTime) {
      setErrorMessages("Please fill in all fields.");
      return;
    }

    const userEmail = getUserEmail();
    if (!userEmail) {
      setErrorMessages("User not logged in.");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        orderID: item.orderID,
        name: item.name,
        price: parseFloat(item.price),
        shape: item.shape,
        quantity: parseInt(item.quantity),
        weight: parseFloat(item.weight),
        image: item.img,
      }));

      const totalAmount = parseFloat(calculateTotal());

      const orderData = {
        userEmail,
        customerName,
        orderItems,
        totalAmount,
        deliveryAddress: address,
        paymentMethod,
        cakeMessage,
        orderDate: new Date(orderDate).toISOString(),
        orderTime: orderTime, // Include the selected time
        status: "Pending",
      };

      console.log("Submitting order data:", orderData);

      await createOrder(orderData);
      setSuccessMessage("Order placed successfully!");

    // Redirect to home page after successful order placement
    setTimeout(() => {
      navigate("/"); // Navigate to the home page
    }, 2000); // Wait for 2 seconds before navigating to allow the success message to be visible

    } catch (error) {
      console.error("Order creation error:", error);
      setErrorMessages(error.response?.data?.message || "Error placing order, please try again.");
    }
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 bg-opacity-80 mb-8"
        >
          &#8592; Back to Cart
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

        {cart.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.orderId} className="flex items-center space-x-4 mb-6">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Shape: {item.shape}</p>
                  <p className="text-gray-500 text-sm">Weight: {item.weight} kg</p>
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <h3 className="text-2xl font-bold mb-4">Customer Information</h3>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-semibold mb-2">Delivery Address</label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your delivery address"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-semibold mb-2">Message on Cake</label>
                <input
                  type="text"
                  id="message"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter a message for the cake"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="orderDate" className="block text-sm font-semibold mb-2"><p>Order Date</p><p className="text-xs text-gray-300">Order Date must be after 2 days</p></label>
                <input
                  type="date"
                  id="orderDateInput"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Time selection */}
              <div className="mb-4">
                <label htmlFor="orderTime" className="block text-sm font-semibold mb-2">Select Delivery Time</label>
                <input
                  type="time"
                  id="orderTime"
                  value={orderTime}
                  onChange={handleOrderTimeChange}
                  min="10:00"
                  max="23:00"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  <div>
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="mr-2"
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                      className="mr-2"
                    />
                    <label htmlFor="online">Online Payment</label>
                  </div>
                </div>
              </div>

              {errorMessages && <p className="text-red-500 text-center">{errorMessages}</p>}
              {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePlaceOrder}
                  className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order' }
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg">Your cart is empty!</p>
        )}
      </div>
    </div>
  );
}

export default Checkout;
