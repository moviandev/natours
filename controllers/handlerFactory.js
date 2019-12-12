const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new AppError('No document avaliable with that ID', 404));

    res.status(204).json({
      status: 'Deleted',
      message: 'Your document has been deleted.'
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updateDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updateDoc)
      return next(new AppError('No Document available with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        updated: updateDoc
      }
    });
  });
