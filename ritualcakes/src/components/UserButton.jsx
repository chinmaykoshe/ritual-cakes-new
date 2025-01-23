import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

function UserButton() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useUser();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("user");

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          setLoading(true);
          const { data } = await axios.get(`https://ritual-cakes-new-ogk5.vercel.app/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(data);
          setFormData(data);
        } catch (err) {
          setError("Error fetching user data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setUserData(formData);
      setIsEditing(false);
    } catch {
      setError("Error updating user data");
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p>Please log in to view your information.</p>
        <button onClick={() => navigate("/login")} className="btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const isAdmin = userEmail === "ritualcake.admin@gmail.com" && userData?.role === "admin";
  const formattedDOB = userData?.dob ? new Date(userData.dob).toLocaleDateString("en-GB") : "";

  return (
    <div className="container">
      <Link to="/" className="link-back">
        &larr; Back to Home
      </Link>
      <h1 className="text-center">Your Information</h1>

      <div className="card">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            {["name", "surname", "mobile", "dob", "address"].map((field) => (
              <div key={field} className="form-group">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === "dob" ? "date" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            ))}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>
              <strong>Name:</strong> {userData?.name} {userData?.surname}
            </p>
            <p>
              <strong>Email:</strong> {userData?.email}
            </p>
            <p>
              <strong>Mobile:</strong> {userData?.mobile}
            </p>
            <p>
              <strong>Date of Birth:</strong> {formattedDOB}
            </p>
            <p>
              <strong>Address:</strong> {userData?.address}
            </p>
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Edit Information
            </button>
          </>
        )}

        <button onClick={() => navigate("/orders")} className="btn-primary mt-4">
          Check Your Orders Here
        </button>

        {isAdmin && (
          <button onClick={() => navigate("/admin/dashboards")} className="btn-admin mt-4">
            Go to Admin Panel
          </button>
        )}
      </div>
    </div>
  );
}

export default UserButton;
