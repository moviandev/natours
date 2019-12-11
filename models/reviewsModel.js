const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: String,
  rating: {
    type: Number,
    max: [5, 'The rating cannot be more than 5'],
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
