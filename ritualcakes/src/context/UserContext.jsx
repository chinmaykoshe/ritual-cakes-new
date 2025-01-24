import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios"; // Importing axios for API requests

// Create UserContext
const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state (null by default)
  const [loading, setLoading] = useState(false); // Loading state to handle async operations
  const [error, setError] = useState(null); // Error state for handling errors

  // Login function to set the user state
  const login = (userData) => {
    setUser(userData); // Update user state on login
  };

  // Logout function to reset the user state
  const logout = () => {
    setUser(null); // Reset user state on logout
  };


  const token = localStorage.getItem("token"); // Get token from localStorage

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("user"); // Get email from localStorage

      if (userEmail && token) { // Check if both email and token exist
        setLoading(true); // Set loading to true while fetching data
        try {
          // Fetch user data from the server using the token
          const response = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`, // Attach token for authentication
            },
          });
          setUser(response.data); // Set fetched user data
          setLoading(false); // Stop loading after data is fetched
        } catch (error) {
          setLoading(false); // Stop loading on error
          setError("Error fetching user data"); // Set error message
        }
      } else {
        setError("No user data found in localStorage"); // If no user data exists
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []); // Dependency array is empty, runs only once when the component mounts

  // Update user data with the new information
  const updateUser = async (updatedData) => {

    if (!token) { // If no token, display an error
      setError("No token found. Please log in again.");
      return;
    }

    setLoading(true); // Set loading to true while updating user
    try {
      // Send PUT request to update user data
      const response = await axios.put(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header with token
          'Content-Type': 'application/json', // Set content type for the request
        },
      });
      setUser(response.data.user); // Update the user state with the updated data
      setLoading(false); // Stop loading after update
    } catch (error) {
      setLoading(false); // Stop loading on error
      setError("Error updating user data"); // Set error message
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error, updateUser }}>
      {children} {/* Render the children components within the context provider */}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => {
  return useContext(UserContext); // Return the UserContext value for easy access
};
