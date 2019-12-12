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

exports.createReview = catchAsync(async (req, res, next) => {
  // checking if exist a tour and a user
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.author) req.body.author = req.user.id;

  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'created',
    data: review
  });
});

// Delete review
exports.deleteReview = factory.deleteOne(Review);
