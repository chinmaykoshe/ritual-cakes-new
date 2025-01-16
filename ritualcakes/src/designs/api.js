import axios from 'axios';

// Set up the base URL for the API
const BASE_URL = 'http://localhost:5001/api/wishlist'; // Change to your backend URL

// Function to get all items from the wishlist
export const getWishlist = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; // Return the list of wishlist items
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error; // Re-throw the error so the calling component can handle it
  }
};

// Function to add an item to the wishlist
export const addToWishlist = async (item) => {
  try {
    const response = await axios.post(BASE_URL, item); // Send item data to backend
    return response.data; // Return the added item
  } catch (error) {
    console.error("Error adding item to wishlist:", error);
    throw error; // Re-throw the error
  }
};

// Function to remove an item from the wishlist
export const removeFromWishlist = async (orderID) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${orderID}`); // Send delete request
    return response.data; // Return success message
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    throw error; // Re-throw the error
  }
};
