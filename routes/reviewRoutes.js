const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });
//  POST  /tour/234ert1/reviews
//  POST  /reviews

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTO("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
module.exports = router;
