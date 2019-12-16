const express = require('express');
const auth = require('../controllers/authController');
const reviews = require('../controllers/reviewsController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    auth.protect,
    auth.restrictTo('user'),
    reviews.setTourUsersId,
    reviews.createReview
  );

router
  .route('/:id')
  .get(reviews.getReview)
  .patch(reviews.updateReview)
  .delete(reviews.deleteReview);

module.exports = router;
