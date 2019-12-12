const mongoose = require('mongoose');

// Parent referencing is to not polute our DB
// Always when we desing an app we have to think it as a thing that will be huge

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating cannot be more than 5'],
      defeault: 4.5
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to an user']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    // we need these two options as true cause when we use a virtual a field that not stored into data base it will do appear to us
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
