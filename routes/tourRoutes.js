const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

// POST /tour/12345/review
// GET /tour/12345/review
// GET /tour/12345/review/12345
// nested route example
// router
//   .route("/:tourId/reviews")
//   .post(
//     authController.protect,
//     authController.restrictTO("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews", reviewRouter); // we get tourId because mergeParams: true in reviewRouter

// router.param('id', tourController.checkID); // param middleware

// Concept: chaining multiple middleware
// create a check body middleware
// check if body contains the name and price properties
// if not, send back 400 (bad request)
// Add it to the post handler stack

const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourController;

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTO("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

router.route("/top-5-cheap").get(tourController.aliasTopTours, getAllTours);

// router.route("/").get(authController.protect, getAllTours).post(createTour);
router
  .route("/")
  .get(getAllTours)
  .post(
    authController.protect,
    authController.restrictTO("admin", "lead-guide"),
    createTour
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/:id")
  .get(getTour)
  .patch(
    authController.protect,
    authController.restrictTO("admin", "lead-guide"),
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTO("admin", "lead-guide"),
    deleteTour
  );

module.exports = router;
