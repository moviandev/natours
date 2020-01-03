const Review = require('../models/reviewsModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

// // checking if exist a tour and a user
exports.setTourUsersId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);

// Update Review
exports.updateReview = factory.updateOne(Review);

// Delete review
exports.deleteReview = factory.deleteOne(Review);
