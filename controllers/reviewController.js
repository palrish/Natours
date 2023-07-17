const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const handler = require('./handlerFactory');

exports.getAllReview = handler.getAll(Review);

exports.getReview = handler.getOne(Review);

exports.setUserTourId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.createReview = handler.createOne(Review);
exports.deleteReview = handler.deleteOne(Review);
exports.updateReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
