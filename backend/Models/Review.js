const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    orderID: { 
      type: String, 
      ref: "Order", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    authorName: { 
      type: String, 
      required: false 
    }, 
    authorEmail: { 
      type: String, 
      required: false,
      set: (email) => email.toLowerCase()
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
