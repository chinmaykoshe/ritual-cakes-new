const express = require("express");
const mongoose = require("mongoose");
const Review = require("../Models/Review");
const router = express.Router();
const ensureAuthenticated = require("./Middlewares/auth"); // Import the authentication middleware

// -------------------------- Helper Functions --------------------------

// Validate that orderID is a valid string
const validateOrderID = (orderID) => typeof orderID === "string" && orderID.trim().length > 0;

// Validate that reviewID is a valid MongoDB ObjectId
const validateReviewID = (reviewID) => mongoose.Types.ObjectId.isValid(reviewID);

// -------------------------- USER ROUTES --------------------------

// Backend route for fetching all reviews (public access)
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// GET reviews for a specific order (public access)
router.get("/reviews/:orderID", async (req, res) => {
  const { orderID } = req.params;

  if (!validateOrderID(orderID)) {
    return res.status(400).json({ error: "Invalid or missing orderID" });
  }

  try {
    const reviews = await Review.find({ orderID }).sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({ error: "No reviews found for this order" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for order:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST a new review (requires authentication)
router.post("/reviews/:orderID", ensureAuthenticated, async (req, res) => {
  const { orderID } = req.params;
  const { content, authorName } = req.body;

  if (!validateOrderID(orderID)) {
    return res.status(400).json({ error: "Invalid orderID format" });
  }

  if (!content || !authorName) {
    return res.status(400).json({ error: "Review content and author name are required" });
  }

  const { email } = req.user;

  try {
    const newReview = new Review({
      orderID,
      content,
      authorName,
      authorEmail: email,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error posting review:", error);
    res.status(500).json({ error: "Failed to post review" });
  }
});

// PUT a review (for editing, requires authentication)
router.put("/reviews/:reviewID", ensureAuthenticated, async (req, res) => {
  const { reviewID } = req.params;
  const { content } = req.body;

  if (!validateReviewID(reviewID)) {
    return res.status(400).json({ error: "Invalid reviewID format" });
  }

  if (!content) {
    return res.status(400).json({ error: "Review content is required" });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewID,
      { content },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// -------------------------- ADMIN ROUTES --------------------------

// DELETE a review (by reviewID, requires authentication)
router.delete("/reviews/:orderID/:reviewID", ensureAuthenticated, async (req, res) => {
  const { orderID, reviewID } = req.params;

  if (!validateOrderID(orderID) || !validateReviewID(reviewID)) {
    return res.status(400).json({ error: "Invalid orderID or reviewID format" });
  }

  try {
    const review = await Review.findOneAndDelete({ _id: reviewID, orderID });

    if (!review) {
      return res.status(404).json({
        error: "Review not found or does not belong to this order",
      });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;
