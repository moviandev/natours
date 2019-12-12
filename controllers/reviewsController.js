const Review = require('../models/reviewsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Review.find();

  res.status(200).json({
    status: 'success',
    data: [review]
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    return next(new AppError('Review not found. Please try again', 404));

  res.status(200).json({
    status: 'success',
    data: review
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'created',
    data: review
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (review)
    return next(new AppError('Review not found, please try again', 404));

  res.status(201).json({
    status: 'success',
    data: review
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (review)
    return next(new AppError('Review not found. Please try again', 404));

  res.status(204).json({
    status: 'deleted',
    message: 'Review deleted'
  });
});
