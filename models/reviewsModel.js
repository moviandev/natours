const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating cannot be more than 5'],
    default: 4.5
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date().now()
  }
});

const Review = mongoose.model('User', reviewSchema);

module.exports = Review;
