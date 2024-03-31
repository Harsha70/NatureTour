const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // can access the public directory

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // if you dont use next it gets stuck here
});

app.use((req, res, next) => {
  console.log('hello from middleware');
  next(); // if you dont use next it gets stuck here
});

// 3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
