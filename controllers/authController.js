const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');

const envV = process.env;

const signToken = id =>
  jwt.sign({ id }, envV.JWT_TOKEN, { expiresIn: envV.JWT_EXP_IN });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // I'm passing all the body requests to create a more secure API
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1-- Check if email and password exist
  if (!email || !password)
    return next(new AppError(`Please provide email and password`, 400));

  // 2-- Check if user exists && password is correct
  // .select is used to get the fields that are hidden in ours outputs
  const user = await User.findOne({
    email
  }).select('+password');

  // We passed the method correctPassword directly on the if statement
  // Beacause if the user doesn't exists it will return false right away
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401));

  // 3-- If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Getting token and check if it's there
  // A common practice is to send the token along with the HTTP headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  // Checking if the token really exists
  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );

  // Verification token

  // How we are working with promises in all project, we promisified the jwt.verify
  // We take promisify from a built-in module of node, we destructed it and take promisify
  // We can call promisify and pass to it the function, in case jwt.verify
  // This verification is to check if the token payload had been modified
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
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user)
    return next(new AppError('There is no user with that email address', 404));

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false
  });

  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Update your password with your new password and passwordConfirm to: ${resetURL}\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 min',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false
    });

    return next(
      new AppError(
        `There was an error sending th email. Please try again!`,
        500
      )
    );
  }
});

exports.resetPass = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the posted password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new AppError('Your current password is wrong', 401));

  // 3) if the passwords is correct, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4) Do login of the user and send JWT
  createSendToken(user, 200, res);
});
