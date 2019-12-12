const Reviews = require('../models/reviewsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Reviews.find();

  res.status(200).json({
    status: 'success',
    data: [review]
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id);

  if (!review)
    return next(new AppError('Review not found. Please try again', 404));

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const review = await Reviews.create(req.body);

  res.status(200).json({
    status: 'created',
    data: review
  });
});
