const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const msg = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(msg, 400);
};

const handleDuplicateErrorDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const msg = `Duplicate field value: ${value}. Try again to another name`;
  return new AppError(msg, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const msg = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational error we trusted
  if (err.isOperational)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  else {
    // PROGRAMMING OR UNKNOWN ERRORS: DON'T LEAK ERROR DETAILS
    global.console.log('ERROR ===> ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
