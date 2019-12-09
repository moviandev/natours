const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1> GLOBAL MIDDLEWARES
// SET SECURITY HTTP HEADERS
app.use(helmet());

// development logging
// Um middleware é uma função que pode mudar os dados que estão chegando.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same IP
// Prevent attackers to make attack with brute force
const limiter = rateLimit({
  // 100 requests per hour, if the api should make more request from one IP this max limiter should be greater
  max: 100,
  // 60 minutes * 60 seconds * 1000 milliseconds
  windowMs: 3600000,
  message: 'Too many request from this IP, please try again in an hour'
});

// Here we are applying this limiter to the api route, this should effect all of our routes
app.use('/api', limiter);

// Body Parser, reading data from the body req.body
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION  against NoSQL query Injection
app.use(mongoSanitize());

// DATA SANATIZATION against XSS
app.use(xss());

app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling routes errors
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
