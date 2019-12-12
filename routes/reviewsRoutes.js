const express = require('express');
const auth = require('../controllers/authController');
const reviews = require('../controllers/reviewsController');

const router = express.Router();

router
  .route('/')
  .get(auth.protect, auth.restrictTo('user'), reviews.getAllReviews)
  .post(reviews.createReview);

module.exports = router;
