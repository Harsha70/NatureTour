const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotpassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect); // Middleware to protect

router.patch(
  "/updateMyPassword",
  // authController.protect,
  authController.updatePassword
);

router.get(
  "/me",
  // authController.protect, // Middleware takes care of it
  userController.getMe,
  userController.getUser
);
router.patch(
  "/updateMe",
  // authController.protect,
  userController.updateMe
);
router.delete(
  "/deleteMe",
  // authController.protect,
  userController.deleteMe
);

router.use(authController.restrictTO("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
