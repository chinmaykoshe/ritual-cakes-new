import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../context/UserContext";

function UserButton() {
  const { user, updateUser, loading, error } = useUser(); // Get user and token from context
  const [isEditing, setIsEditing] = useState(false); // Manage edit mode
  const [formData, setFormData] = useState({
    name: user && user.user ? user.user.name : "",
    surname: user && user.user ? user.user.surname : "",
    mobile: user && user.user ? user.user.mobile : "",
    address: user && user.user ? user.user.address : "",
    dob: user && user.user ? user.user.dob : "",
  });
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  // Null check for userData before formatting dob
  const formattedDOB = user && user.user ? new Date(user.user.dob).toLocaleDateString("en-GB") : "";

  // Using useEffect to update formData when user data changes
  useEffect(() => {
    if (user && user.user) {
      setFormData({
        name: user.user.name || "",
        surname: user.user.surname || "",
        mobile: user.user.mobile || "",
        address: user.user.address || "",
        dob: user.user.dob || "",
      });
    }
  }, [user]); // This will trigger when the `user` data changes

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(formData); // Update user data through context
    setIsEditing(false); // Exit edit mode
    setTimeout(() => {
    window.location.reload();
      
    }, 1100);
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

        <h1 className="text-3xl font-bold mb-6 text-center">Your Information</h1>

        {!token ? (
          <div className="text-center">
            <p className="text-black-500 font-semibold">Please log in to view your information.</p>
            <button
              onClick={() => navigate("/login")} // Redirect to login page
              className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
            >
              Go to Login
            </button>
          </div>
        ) : loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : user && user.user ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Display user info */}
            {!isEditing ? (
              <>
                <p className="mb-2">
                  <strong>Name:</strong> {user.user.name} {user.user.surname}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user.user.email}
                </p>
                <p className="mb-2">
                  <strong>Mobile:</strong> {user.user.mobile}
                </p>
                <p className="mb-2">
                  <strong>Date of Birth:</strong> {formattedDOB}
                </p>
                <p className="mb-2">
                  <strong>Address:</strong> {user.user.address}
                </p>
                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-lg hover:text-yellow-500 hover:bg-white hover:border-2 hover:border-yellow-500"
                >
                  Edit
                </button>
              </>
            ) : (
              // Edit form
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block">Name:</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block">Surname:</label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    value={formData.surname}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block">Mobile:</label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block">Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    value={formData.dob}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block">Address:</label>
                  <textarea
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  className="m-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:text-green-500 hover:bg-white hover:border-2 hover:border-green-500"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className=" bg-yellow-500 text-white py-2 px-6 rounded-lg hover:text-yellow-500 hover:bg-white hover:border-2 hover:border-yellow-500"
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Add 'Check your orders' button */}
            <div className="mt-2">
              <button
                onClick={() => navigate("/orders")} // Redirect to orders page
                className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
              >
                Check Your Orders Here
              </button>
            </div>
            {/* Add 'Go to Admin Panel' button */}
            {userEmail === "ritualcake.admin@gmail.com" && role === "admin" && (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/admin/dashboards")} // Redirect to admin panel page
                  className="mt-2 bg-green-500 text-white py-2 px-6 rounded-lg hover:text-green-500 hover:bg-white hover:border-2 hover:border-green-500"
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
