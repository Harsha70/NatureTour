const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

// 1) Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // can access the public directory

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // if you dont use next it gets stuck here
});

// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   next(); // if you dont use next it gets stuck here
// });

// 3) Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// all considers all http methods
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Cant find ${req.originalUrl} on this server`,
  // });

  // or

  // const err = new Error(`Cant find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err)

  // or

  next(
    new AppError(new Error(`Cant find ${req.originalUrl} on this server`, 404))
  );
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
