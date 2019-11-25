const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const envV = process.env;

const signToken = id => {
  return jwt.sign({ id }, envV.JWT_TOKEN, {
    expiresIn: envV.JWT_EXP_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // I'm passing all the body requests to create a more secure API
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'created',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1-- Check if email and password exist
  if (!email || !password)
    return next(new AppError(`Please provide email and password`, 400));

  // 2-- Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email and password', 401));
  // 3-- If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Getting token and check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user)
    return next(
      new AppError(
        'The user belonging to the token does not exist anymore',
        401
      )
    );

  // check if user changed password after the token was issued
  if (user.changePasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password. Please log in again', 401)
    );

  // Grant access to protected route && Saving the user data into the request
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  // Roles is an array
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };
};

exports.forgotPass = catchAsync(async (req, res, next) => {
  // Get user based on posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with that email address', 404));

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  // Send it to user's email

  next();
});
exports.resetPass = (req, res, next) => {};
