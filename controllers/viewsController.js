const Tour = require('./../models/tourModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'Overview',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.login = (req, res) => {
  res.status(200).render('login', {
    title: 'login',
  });
};

exports.signup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create Account',
  });
};

exports.me = (req, res) => {
  res.status(200).render('account', {
    title: 'My profile',
  });
};

exports.myTour = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourId = bookings.map((e) => e.tour);
  const tours = await Tour.find({ _id: { $in: tourId } });
  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});
