const express = require('express');
const authController = require('../controllers/authController');
const reviews = require('../controllers/reviewsController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('user'),
    reviews.setTourUsersId,
    reviews.createReview
  );

router
  .route('/:id')
  .get(reviews.getReview)
  .patch(authController.restrictTo('admin', 'user'), reviews.updateReview)
  .delete(authController.restrictTo('admin', 'user'), reviews.deleteReview);

module.exports = router;
