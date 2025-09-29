import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function UserButton() {
  const { user, updateUser, loading, error } = useUser(); 
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    mobile: "",
    address: "",
    dob: "",
  });

  const navigate = useNavigate();

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
  }, [user]);

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setTimeout(() => window.location.reload(), 1100);
  };

  const formattedDOB = user?.user?.dob
    ? new Date(user.user.dob).toLocaleDateString("en-GB")
    : "";

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mx-2 max-w-7xl md:mx-auto py-4 md:py-12 bg-white bg-opacity-70 rounded-lg md:px-2 lg:p-8 mt-2 lg:mt-16 shadow-lg">
      <div className="container mx-auto p-2 md:py-4 md:px-6">
        <div className="mb-6">
          <Link
            to="/"
            className="text-darkcustombg1 font-montserrat hover:text-darkcustombg1 active:text-darkcustombg2 transition-colors duration-300"
          >
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Your Information</h1>

        {!user?.user ? (
          <div className="text-center">
            <p className="text-black-500 font-semibold">
              Please log in to view your information.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-lg hover:text-yellow-500 hover:bg-white hover:border-2 hover:border-yellow-500"
                >
                  Edit
                </button>
              </>
            ) : (
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

            <div className="mt-2">
              <button
                onClick={() => navigate("/orders")}
                className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
              >
                Check Your Orders Here
              </button>
            </div>

            {/* Admin button: shows only if role is admin AND email matches */}
            {user.user.role === "admin" && user.user.email === "ritualcake.admin@gmail.com" && (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/admin/dashboards")}
                  className="mt-2 bg-green-500 text-white py-2 px-6 rounded-lg hover:text-green-500 hover:bg-white hover:border-2 hover:border-green-500"
                >
                  Go to Admin Panel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserButton;
