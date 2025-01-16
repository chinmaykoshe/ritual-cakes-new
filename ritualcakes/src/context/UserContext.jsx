import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios"; // Don't forget to import axios

// Create UserContext
const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in
  const [loading, setLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  const login = (userData) => {
    setUser(userData); // Update user state when logging in
  };

  const logout = () => {
    setUser(null); // Reset user state when logging out
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userEmail && token) {
        setLoading(true);
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userEmail}`, {
            headers: {
              Authorization: `${token}`, // Ensure "Bearer " is added to the token
            },
          });
          setUser(response.data); // Set user data
          setLoading(false); // Stop loading
        } catch (error) {
          setLoading(false); // Stop loading
          setError("Error fetching user data");
          console.error("Error fetching user data:", error);
        }
      } else {
        setError("No user data found in localStorage");
      }
    };

    fetchUserData();
  }, []); // Runs once when the component is mounted

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => {
  return useContext(UserContext);
};
