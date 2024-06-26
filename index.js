const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static(`${__dirname}/public`)); // can access the public directory
app.use(express.static(path.join(__dirname, "public")));
// 1) Global Middleware
// set security http headers
// app.use(helmet());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json());
app.use(cookieParser());
// Data sanitization against NOSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "maxGroupSize",
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
      "difficulty",
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers, req.cookies);
  next(); // if you dont use next it gets stuck here
});

// app.use((req, res, next) => {
//   console.log("hello from middleware");
//   next(); // if you dont use next it gets stuck here
// });

// 3) Routes

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

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
