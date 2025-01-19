import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // Ensure axios is installed

function UserButton() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Token stored in localStorage
  const userEmail = localStorage.getItem("user"); // User email stored in localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          setLoading(true);
          const response = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, {
            headers: { Authorization: `Bearer ${token}` }, // Send token in the headers
          });
          setUserData(response.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching user data:", error.response || error); // Log full error
          setError("Error fetching user data");
        }
      }
    };

    fetchUserData();
  }, [token]);

  // Null check for userData before formatting dob
  const formattedDOB = userData ? new Date(userData.dob).toLocaleDateString("en-GB") : "";

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 bg-opacity-80 mb-8"
        >
          &#8592; Back to Previous Page
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center">Your Information</h1>

        {!token ? (
          <div className="text-center">
            <p className="text-red-500 font-semibold">Please log in to view your information.</p>
            <button
              onClick={() => navigate("/login")} // Redirect to login page
              className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
            >
              Go to Login
            </button>
          </div>
        ) : loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : userData ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-2">
              <strong>Name:</strong> {userData.name} {userData.surname}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="mb-2">
              <strong>Mobile:</strong> {userData.mobile}
            </p>
            <p className="mb-2">
              <strong>Date of Birth:</strong> {formattedDOB}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {userData.address}
            </p>
            {/* Add 'Check your orders' button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/orders")} // Redirect to orders page
                className="bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:bg-brown"
              >
                Check Your Orders Here
              </button>
            </div>
            {/* Add 'Go to Admin Panel' button */}
            {userEmail === "ritualcake.admin@gmail.com" && userData.role === "admin" && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/admin/dashboards")} // Redirect to admin panel page
                  className="bg-green-300 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                >
                  Go to Admin Panel
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center">No user information available.</p>
        )}
      </div>
    </div>
  );
}

export default UserButton;
