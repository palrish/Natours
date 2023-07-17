const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewsRouter = require('./routes/viewsRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARE
app.use(helmet());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
      'difficulty',
      'duration',
    ],
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests try after an hour',
});
app.use('/api', limiter);
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

app.use('/',viewsRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist`, 404));
});

app.use(globalErrorHandler);
module.exports = app;