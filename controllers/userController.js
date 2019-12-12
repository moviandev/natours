// Mostrar todos os usuários

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Method to ignore unwanted fields in the request.body
// obj stands to the object that we want to filter [req.body]
// allowedFields is an array of strings
const filterObj = (obj, ...allowedFields) => {
  // We generated this empty object to save it later
  const newObj = {};
  // We did transform our param into a array then we looped through it
  Object.keys(obj).forEach(el => {
    // if the allowdFields we have to add that into a new object
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  // Here we returned our filtered object
  return newObj;
};

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
  // Filtering out unwanted fields names that not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update user doc
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // We not really delete a user in case he|she wants to use our app again
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'deleted',
    data: null
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

// Delete User
exports.deleteUser = factory.deleteOne(User);
