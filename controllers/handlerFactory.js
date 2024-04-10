const AppError = require("./../utils/appError");

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err)); // next(err) triggers the err middleware
  };
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
