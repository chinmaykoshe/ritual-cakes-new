const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    orderID: { 
      type: String, 
      ref: "Order", 
      required: true 
    }, // Reference to the Order model, changed to ObjectId
    content: { 
      type: String, 
      required: true 
    }, // Review content
    authorName: { 
      type: String, 
      required: false 
    }, // Author name (from authenticated user)
    authorEmail: { 
      type: String, 
      required: false,
      set: (email) => email.toLowerCase() // Automatically convert email to lowercase
    }, // Author email (from authenticated user)
    createdAt: { 
      type: Date, 
      default: Date.now 
    }, // Timestamp for review creation
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
