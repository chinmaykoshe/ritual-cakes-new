import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Toggle password visibility for the new password field
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prev) => !prev);
  };


  // Toggle password visibility for the confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  const apiUrl = "https://ritual-cakes-new-ogk5.vercel.app/api";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={newPasswordVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {newPasswordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i> // Eye normal (password hidden)
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i> // Eye solid (password visible)
              )}
            </button>
          </div>

          <label className="block mb-2 text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {confirmPasswordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i> // Eye normal (password hidden)
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i> // Eye solid (password visible)
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
