// Mostrar todos os usuários

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

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
