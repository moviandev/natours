const express = require('express');
const tourController = require('./../controllers/tourController');
const reviewsController = require('../controllers/reviewsController');
const auth = require('./../controllers/authController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(/*auth.restrict('admin')*/ tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(auth.protect, /*auth.restrict('admin')*/ tourController.updateTour)
  .delete(auth.protect, /*auth.restrict('admin')*/ tourController.deleteTour);

router
  .route('/:tourId/reviews')
  .post(auth.protect, auth.restrictTo('user'), reviewsController.createReview)
  .get(auth.protect, auth.restrictTo('user'), reviewsController.getAllReviews);

module.exports = router;
