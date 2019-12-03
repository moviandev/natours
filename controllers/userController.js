// Mostrar todos os usuários

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const tour = await User.find();

  res.status(200).json({
    status: 'success',
    results: tour.length,
    data: {
      tour
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        400
      )
    );

  // 2) Update user doc
  const user = await User.findByIdAndUpdate(req.user.id, x, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {}
  });
});

// Criar usuários

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

// Mostrar usuário por id

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

// Update usuários

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};

// Update usuários

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet implemented'
  });
};
