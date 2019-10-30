const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1> MIDDLEWARES
// Um middleware é uma função que pode mudar os dados que estão chegando.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling routes errors
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'Not Found',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

module.exports = app;
