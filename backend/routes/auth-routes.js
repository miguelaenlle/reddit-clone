const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/auth-controller");

router.post(
  "/signup",
  [
    check("username")
      .isLength({
        min: 3,
        max: 20,
      })
      .toLowerCase()
      .blacklist(" "),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({
      min: 6,
    }),
  ],
  authController.createUser
);

router.post(
  "/resend-email",
  [check("email").normalizeEmail().isEmail()],
  authController.resendEmailVerification
);

router.post(
  "/confirm-email",
  [check("verificationToken").not().isEmpty()],
  authController.confirmVerificationToken
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({
      min: 6,
    }),
  ],
  authController.loginUser
);

router.post(
  "/forgot-password",
  [check("email").normalizeEmail().isEmail()],
  authController.sendForgotPasswordEmail
);

router.post(
  "/change-password",
  [
    check("email").normalizeEmail().isEmail(),
    check("newPassword").isLength({
      min: 6,
    }),
    check("forgotPasswordToken").not().isEmpty(),
  ],
  authController.changePassword
);

module.exports = router;
