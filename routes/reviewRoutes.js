const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });
//  POST  /tour/234ert1/reviews
//  POST  /reviews

router.use(authController.protect);

router.route("/").get(reviewController.getAllReviews).post(
  // authController.protect,
  authController.restrictTO("user"),
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTO("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTO("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
