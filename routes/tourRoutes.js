const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();
// router.param('id', tourController.checkID); // param middleware

// Concept: chaining multiple middleware
// create a check body middleware
// check if body contains the name and price properties
// if not, send back 400 (bad request)
// Add it to the post handler stack

const { getAllTours, createTour, getTour, updateTour, deleteTour } =
  tourController;

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router.route("/top-5-cheap").get(tourController.aliasTopTours, getAllTours);

router.route("/").get(authController.protect, getAllTours).post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTO("admin", "lead-guide"),
    deleteTour
  );

// POST /tour/12345/review
// GET /tour/12345/review
// GET /tour/12345/review/12345
// nested route example
router
  .route("/:tourId/reviews")
  .post(
    authController.protect,
    authController.restrictTO("user"),
    reviewController.createReview
  );

module.exports = router;
