import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reviews = ({ orderID }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl =  `https://ritual-cakes-new-ogk5.vercel.app/api/reviews`;
  const isLoggedIn = localStorage.getItem("user");
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${apiUrl}/${orderID}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError("Unable to load reviews. Please try again later.");
      }
    };

    if (orderID) {
      fetchReviews();
    }
  }, [orderID, apiUrl]);
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
    const token = localStorage.getItem("token");
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
        return;
      }
      setReviews((prevReviews) => [responseData, ...prevReviews]); 
      setNewReview(""); 
      setError(null);
    } catch (error) {
      setError("Failed to submit review. Please try again later.");
    }
  };

  return (
    <div className="reviews mt-4">
      <h4 className="text-sm font-semibold text-gray-800">Customer Reviews:</h4>
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
          <div className="mt-4">
            <input
              type="text"
              placeholder="Your Name"
              value={authorName}
required
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <input
              type="email"
              placeholder="Your Email"
              value={localStorage.getItem("user") || ""}
              readOnly
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Write your review here..."
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
required
            />
          </div>
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
          <p className="mt-4 text-gray-600">Please log in to post a review.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-darkcustombg2 text-white py-2 px-6 rounded-lg hover:text-darkcustombg2 hover:bg-white hover:border-2 hover:border-darkcustombg2"
          >
            Login to Post Review
          </button>
        </>
      )}
    </div>
  );
};

export default Reviews;