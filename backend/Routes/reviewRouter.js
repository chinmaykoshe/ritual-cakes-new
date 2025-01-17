const express = require("express");
const mongoose = require("mongoose");
const Review = require("../Models/Review");
const router = express.Router();
const ensureAuthenticated = require("./Middlewares/auth"); // Import the authentication middleware

// Middleware to check if the user is an admin
const ensureAdmin = (req, res, next) => {
  if (!req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
};

// -------------------------- USER ROUTES --------------------------

// Backend route for fetching all reviews (public access)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find(); // Get all reviews from the database
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// GET reviews for a specific order (public access)
router.get("/:orderID", async (req, res) => {
  const { orderID } = req.params;
  // Fetch reviews for this orderID
  const reviews = await Review.find({ orderID }).sort({ createdAt: -1 });
  if (!reviews) {
    return res.status(404).json({ error: "No reviews found" });
  }
  res.status(200).json(reviews); // Return the reviews
});

// POST a new review (requires authentication)
router.post("/:orderID", ensureAuthenticated, async (req, res) => {
  const { orderID } = req.params;
  const { content, authorName } = req.body; // Extract authorName from the body

  // Ensure content and authorName are provided
  if (!content || !authorName) {
    return res.status(400).json({ error: "Review content and author name are required" });
  }

  // Ensure orderID is a valid string
  if (!orderID || typeof orderID !== "string") {
    return res.status(400).json({ error: "Invalid orderID format" });
  }

  // Ensure the email is available for the user
  const { email } = req.user;  // Getting the email from the authenticated request

  try {
    const newReview = new Review({ 
      orderID, 
      content, 
      authorName, 
      authorEmail: email // Author email still fetched from authenticated user
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ error: "Failed to post review" });
  }
});

// PUT a review (for editing)
router.put("/:reviewID", ensureAuthenticated, async (req, res) => {
  const { reviewID } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Review content is required" });
  }

  try {
    const review = await Review.findByIdAndUpdate(reviewID, { content }, { new: true });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// -------------------------- ADMIN ROUTES --------------------------

// DELETE a review (by reviewID, requires authentication and admin role)
router.delete("/:orderID/:reviewID", ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { orderID, reviewID } = req.params;

  // Ensure both orderID and reviewID are valid strings
  if (!orderID || typeof orderID !== "string" || !reviewID || !mongoose.Types.ObjectId.isValid(reviewID)) {
    return res.status(400).json({ error: "Invalid orderID or reviewID format" });
  }

  try {
    const review = await Review.findOneAndDelete({ _id: reviewID, orderID });

    if (!review) {
      return res.status(404).json({ error: "Review not found or does not belong to this order" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
