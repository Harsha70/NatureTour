const Review = require("./../models/reviewModel");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); // next(err) triggers the err middleware
  };
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  // parent referencing populate implemented in query middleware
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});