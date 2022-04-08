const HttpError = require("../models/http-error");

const invalidInputsError = new HttpError(
  "Invalid inputs passed, please check your data.",
  422
);

// Auth errors

const failedToFindUserError = new HttpError(
  "Failed to find the designated user.",
  404
);

const userIsVerifiedError = new HttpError("User is already verified.", 422);

const userExistsError = new HttpError(
  "User exists already, please login instead.",
  422
);

const usernameExistsError = new HttpError(
  "Username already exists, please find a different username.",
  422
);

const signupFailedError = new HttpError(
  "Signing up failed, please try again.",
  500
);

const loginFailedError = new HttpError("Login failed, please try again.", 500);

const signupTokenVerifyError = new HttpError(
  "Token verification for the signup failed.",
  500
);

const passwordResetFailedError = new HttpError(
  "An error in the password reset occured, please try again.",
  500
);

const passwordResetTokenVerifyError = new HttpError(
  "Token verification for the password reset failed, please try again.",
  500
);

const invalidPasswordError = new HttpError("Incorrect password", 422);

// users

const requestTooLargeError = new HttpError("Request size too large, please request less results.")


module.exports = {
  invalidInputsError,
  userExistsError,
  usernameExistsError,
  signupFailedError,
  failedToFindUserError,
  userIsVerifiedError,
  signupTokenVerifyError,
  loginFailedError,
  invalidPasswordError,
  passwordResetFailedError,
  passwordResetTokenVerifyError,
  requestTooLargeError
};
