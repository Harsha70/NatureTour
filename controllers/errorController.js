const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}, Please use another name`;
  return new AppError(message, 400);
};

const handleJsobWebTokenError = () => {
  // console.log("handleJsobWebTokenError");
  return new AppError("Invalid token. Please login again", 401);
};
const handleTokenExpiredError = () => {
  console.log("handleTokenExpiredError");
  return new AppError("JWT token session expired. Please login again", 401);
};
module.exports = (err, req, res, next) => {
  // console.log("err.stack", err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    // Operational, trusted error: send message to client
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsobWebTokenError();
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: dont leak error detail to client
    } else {
      // 1) Log error
      // console.log("error:", err);
      //2) Send generic message
      res
        .status(500)
        .json({ status: "error", message: "Something went very wrong" });
    }
  }
};
