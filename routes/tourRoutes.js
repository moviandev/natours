const express = require('express');
const tourController = require('../controllers/tourController');
const auth = require('../controllers/authController');
const reviewRouter = require('./reviewsRoutes');

const router = express.Router();

// Whenever it finds a url like this will get the review router
router.use('/:tourId/reviews', reviewRouter);

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

module.exports = router;
