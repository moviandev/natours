const express = require('express');
const auth = require('../controllers/authController');
const reviews = require('../controllers/reviewsController');

const router = express.Router();

router
  .route('/')
  .get(reviews.getAllReviews)
  .post(reviews.createReview);

router
  .route('/:id')
  .get(reviews.getReview)
  .patch(reviews.updateReview)
  .delete(reviews.deleteReview);

module.exports = router;
