const express = require('express');
const auth = require('../controllers/authController');
const reviews = require('../controllers/reviewsController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth.protect, auth.restrictTo('user'), reviews.createReview);

router.route('/:id').delete(reviews.deleteReview);

module.exports = router;
