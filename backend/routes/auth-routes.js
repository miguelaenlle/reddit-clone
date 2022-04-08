const express = require("express");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth-controller");

const authCallLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

router.post(
  "/signup",
  authCallLimiter,
  [
    check("username").isLength({
      min: 3,
      max: 20,
    }),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({
      min: 6,
    }),
  ],
  authController.createUser
);

router.post(
  "/resend-email",
  authCallLimiter,
  [check("email").normalizeEmail().isEmail()],
  authController.resendEmailVerification
);

router.post(
  "/confirm-email",
  authCallLimiter,
  [check("verificationToken").not().isEmpty()],
  authController.confirmVerificationToken
);

router.post(
  "/login",
  authCallLimiter,
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
  authCallLimiter,
  [
    check("email").normalizeEmail().isEmail()
  ],
  authController.sendForgotPasswordEmail
);

router.post(
  "/change-password",
  authCallLimiter,
  [
    check("email").normalizeEmail().isEmail(),
    check("newPassword").isLength({
      min: 6,
    }),
    check("forgotPasswordToken").not().isEmpty()
  ],
  authController.changePassword
);

module.exports = router;
