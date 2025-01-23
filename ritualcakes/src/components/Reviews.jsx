import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reviews = ({ orderID }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [authorName, setAuthorName] = useState(""); // For user's name
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To navigate to the login page

  const apiUrl =  `${process.env.REACT_APP_API_URL}/reviews`;

  const isLoggedIn = localStorage.getItem("user");

  // Fetch reviews when orderID changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiUrl}/${orderID}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load reviews. Please try again later.");
      }
    };

    if (orderID) {
      fetchReviews();
    }
  }, [orderID, apiUrl]);

  // Handle new review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) {
      setError("Please enter a review.");
      return;
    }

    if (!authorName.trim()) {
      setError("Please provide your name.");
      return;
    }

    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (!token) {
      setError("You must be logged in to post a review.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${orderID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newReview,
          authorName: authorName,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError(responseData.message || "Failed to submit review.");
        console.error("Error Response:", responseData);
        return;
      }

      setReviews((prevReviews) => [responseData, ...prevReviews]); // Add the new review at the top
      setNewReview(""); // Clear the textarea
      setError(null); // Reset any previous error
    } catch (error) {
      console.error("Error submitting review:", error.message);
      setError("Failed to submit review. Please try again later.");
    }
  };

  return (
    <div className="reviews mt-4">
      <h4 className="text-sm font-semibold text-gray-800">Customer Reviews:</h4>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Existing reviews */}
      {reviews.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {reviews.map((review, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 bg-white px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <p className="font-bold text-gray-900">{review.authorName}</p>
              <p className="italic text-gray-800 mt-2">"{review.content}"</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 text-gray-500">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      <hr className="border-2 border-darkcustombg1 m-12 md:mx-20" />

      {isLoggedIn ? (
        <>
          {/* Input fields for name and email */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email input remains read-only, just for display */}
          <div className="mt-4">
            <input
              type="email"
              placeholder="Your Email"
              value={localStorage.getItem("user") || ""}
              readOnly // Email fetched from localStorage
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Review textarea */}
          <div className="mt-4">
            <textarea
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Submit Review
          </button>
        </>
      ) : (
        <>
          {/* If not logged in, show login button and a message */}
          <p className="mt-4 text-gray-600">Please log in to post a review.</p>
          <button
            onClick={() => navigate("/login")} // Navigate to login page
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          >
            Login to Post Review
          </button>
        </>
      )}
    </div>
  );
};

export default Reviews;
