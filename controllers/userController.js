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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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

exports.getAllUsers = factory.getAll(User);

// Create users
exports.createUser = factory.createOne(User);

// Mostrar usuário por id

exports.getUser = factory.getOne(User);

// Update user
// DO NOT UPDATE PASSWORD WITH THIS ROUTE
exports.updateUser = factory.updateOne(User);

// Delete User
exports.deleteUser = factory.deleteOne(User);
