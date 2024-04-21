const AppError = require("./../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    //populate() is going to get data from REFERENCING only in the query and not form DB
    if (populateOption) query = query.populate(populateOption);
    const doc = await query;
    // Model.findById(req.params.id)
    //     .populate({
    //       path: "guides",
    //       select: "-__v -passwordChangedAt",
    //     })
    //     .populate("reviews");
    if (!doc) {
      return next(new AppError("No document found with that ID", 404)); // triggers error middleware
    }
    res.status(200).json({
      status: "success",
      data: { data: doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow nested get reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Execute Query
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // populating implemented in query middleware

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime, // from middleware.
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
