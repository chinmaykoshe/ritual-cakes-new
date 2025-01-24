import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the CartContext
function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [errorMessages, setErrorMessages] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("user"); // Check if user is logged in

  useEffect(() => {
    setLoading(true); // Set loading to true when component mounts
    // Simulate data loading (e.g., fetching cart data if needed)
    setTimeout(() => {
      setLoading(false); // Set loading to false after data is "loaded"
    }, 1000); // You can replace this with actual async data fetching if needed
  }, [cart]);

  // Calculate total price
  const calculateTotal = () => {
    return cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  };

  // Calculate total number of items
  const calculateTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const handleRemoveFromCart = (orderId) => {
    try {
      removeFromCart(orderId); // Remove item from the cart
      setErrorMessages("Item removed successfully.");
      setTimeout(() => setErrorMessages(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      setErrorMessages("Error removing item from cart.");
      setTimeout(() => setErrorMessages(""), 3000);
    }
  };

  const handleQuantityChange = (orderId, action) => {
    try {
      const item = cart.find((item) => item.orderID === orderId);
      const newQuantity = action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      updateQuantity(orderId, newQuantity); // Update quantity in the context
    } catch (error) {
      setErrorMessages("Error updating quantity.");
      setTimeout(() => setErrorMessages(""), 3000);
    }
  };

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
         {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/" 
          className="text-darkcustombg1 font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
        >
          &larr; Back to Home
        </Link>
      </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {errorMessages && <p className="text-red-500 text-center">{errorMessages}</p>}

        {!isLoggedIn ? (
          <div className="text-center">
            <p className="text-black font-semibold">Please log in to add items to the cart.</p>
            <button
              onClick={() => navigate("/login")} // Redirect to login page
              className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
            >
              Go to Login
            </button>
          </div>
        ) : loading ? (
          <p className="text-center p-4">Loading your cart... </p>
        ) : cart?.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="text-right">
              <p className="text-lg font-semibold">
                Total Items: <span>{calculateTotalItems()}</span>
              </p>
            </div>
            {cart.map((item) => (
              <div
                key={item.orderID}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center sm:items-start"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <p className="text-gray-500 text-sm">Shape: {item.shape}</p>
                    <p className="text-gray-500 text-sm">Weight: {item.weight}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.orderID, "decrement")}
                        className="px-2 md:px-4 py-1 border rounded hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border mx-2">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.orderID, "increment")}
                        className="px-2 md:px-4 py-1 border rounded hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto text-center sm:text-right mt-4 sm:mt-0">
                  <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.orderID)}
                    className="text-red-500 font-bold hover:text-red-700 mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 mx-6">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/checkout")} // Redirect to /checkout
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Cart;
