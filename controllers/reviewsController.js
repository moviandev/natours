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

  res.status(200).json({
    status: 'success',
    data: review
  });
});
