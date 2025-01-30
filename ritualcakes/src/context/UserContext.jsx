import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const login = (userData) => {
    setUser(userData);
  };
  const logout = () => {
    setUser(null);
  };
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = localStorage.getItem("user");
      if (userEmail && token) {
        setLoading(true); 
        try {
          const response = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Error fetching user data");
        }
      } else {
        setError("No user data found in localStorage");s
      }
    };
    fetchUserData();
  }, []);
  const updateUser = async (updatedData) => {
    if (!token) { 
      setError("No token found. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json', 
        },
      });
      setUser(response.data.user); 
      setLoading(false);
    } catch (error) {
      setLoading(false); 
      setError("Error updating user data"); 
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error, updateUser }}>
      {children} 
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext); 
};
