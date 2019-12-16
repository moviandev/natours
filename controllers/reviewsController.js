const Review = require('../models/reviewsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const review = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    data: [review]
  });
});

// // checking if exist a tour and a user
exports.setTourUsersId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);

// Update Review
exports.updateReview = factory.updateOne(Review);

// Delete review
exports.deleteReview = factory.deleteOne(Review);
