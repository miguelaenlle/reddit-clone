const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const sendVerificationEmail = require("../util/mail/send-verification-email");
const sendResetEmail = require("../util/mail/send-reset-email");

const hashPassword = require("../helpers/bcrypt/hash-password");

const User = require("../models/user");

const generateSignupToken = require("../helpers/jwt/generate-signup-token");
const generateLoginToken = require("../helpers/jwt/generate-login-token");
const generateForgotPasswordToken = require("../helpers/jwt/generate-forgot-password-token");

const verificationTokenIsValid = require("../helpers/jwt/verify-confirmation-token");
const verificationResetTokenIsValid = require("../helpers/jwt/verify-reset-token");

const validatePassword = require("../helpers/bcrypt/compare-hashed-password");

const errorMessages = require("../constants/errors");

const createUser = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { username, email, password } = request.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (errorMessage) {
    return response.status(422).json({
      emailError: true,
      usernameError: false,
      message: "Email already exists.",
    });
  }

  if (existingUser) {
    return next(errorMessages.userExistsError);
  }

  try {
    const usernameExists = await User.findOne({ username: username });
    if (usernameExists) {
      return response.status(422).json({
        emailError: false,
        usernameError: true,
        message: "Username already exists.",
      });
    }
  } catch (errorMessage) {
    return next(errorMessages.invalidInputsError);
  }

  let hashedPassword;

  try {
    hashedPassword = await hashPassword(password);
  } catch (errorMesge) {
    const error = new HttpError(
      "Could not create the user, please try again.",
      500
    );
    next(error);
  }

  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
    isVerified: false,
  });

  try {
    await newUser.save();
  } catch (errorMessage) {
    return next(errorMessages.signupFailedError);
  }

  let signupToken;
  try {
    signupToken = await generateSignupToken(newUser.id);
  } catch (errorMessage) {
    return next(errorMessages.signupFailedError);
  }

  try {
    const response = await sendVerificationEmail(
      newUser.email,
      process.env.SENDGRID_EMAIL,
      signupToken
    );
  } catch (errorMessage) {
    return next(errorMessages.signupFailedError);
  }

  return response.status(201).json({
    user: {
      id: newUser.id,
      email: newUser.email,
      message: "Created new account. Please verify your email to log in.",
    },
  });
};

const resendEmailVerification = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    // needs email and id
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email } = request.body;
  let existingUser;

  try {
    existingUser = User.findOne({ email: email });
  } catch (error) {
    return next(errorMessages.failedToFindUserError);
  }

  if (existingUser.isVerified) {
    return next(errorMessages.userIsVerifiedError);
  }

  let signupToken;
  try {
    signupToken = await generateSignupToken(existingUser.id);
  } catch (errorMessage) {
    return next(errorMessages.signupFailedError);
  }

  try {
    await sendVerificationEmail(email, process.env.SENDGRID_EMAIL, signupToken);
  } catch (errorMessage) {
    return next(errorMessages.signupFailedError);
  }

  return response.status(201).json({
    message: "A confirmation email was successfully resent.",
  });
};

const confirmVerificationToken = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    // needs email and id
    return next(errorMessages.invalidInputsError);
  }
  const { verificationToken } = request.body;
  let userId;
  try {
    userId = verificationTokenIsValid(verificationToken);
  } catch (errorMessage) {
    return next(errorMessages.signupTokenVerifyError);
  }
  let existingUser;
  if (!userId) {
    return next(errorMessages.signupTokenVerifyError);
  }
  try {
    existingUser = await User.findById(userId).exec();
  } catch (errorMessage) {
    return next(errorMessages.failedToFindUserError);
  }

  if (!existingUser) {
    return next(errorMessages.failedToFindUserError);
  }
  if (existingUser.isVerified) {
    return next(errorMessages.userIsVerifiedError);
  }

  try {
    
    existingUser.isVerified = true;
    await existingUser.save();
  } catch (errorMessage) {
    return next(errorMessages.signupTokenVerifyError);
  }

  return response.status(201).json({
    message: "Succesfully authenticated user. You may now log in.",
  });
};

const loginUser = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { email, password } = request.body;

  // check if the user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).exec();
    if (!existingUser) {
      return next(errorMessages.failedToFindUserError);
    }
  } catch (errorMessage) {
    return next(errorMessages.failedToFindUserError);
  }

  // compare inputted password to hashed password
  try {
    const passwordValid = await validatePassword(
      password,
      existingUser.password
    );
    if (!passwordValid) {
      return next(errorMessages.invalidPasswordError);
    }
  } catch (errorMessage) {
    return next(errorMessages.loginFailedError);
  }

  // check if the user is authenticated
  const userAuthenticated = existingUser.isVerified;
  if (!userAuthenticated) {
    return response.status(401).json({
      message: "Please validate your email.",
    });
  }

  // generate JWT token
  let loginToken;
  try {
    loginToken = await generateLoginToken(existingUser.id, existingUser.email);
  } catch (errorMessage) {
    return next(errorMessage.loginFailedError);
  }

  // send JWT token
  return response.status(201).json({
    id: existingUser.id,
    email: existingUser.email,
    token: loginToken,
    message: "Successfully logged in user.",
  });
};

const sendForgotPasswordEmail = async (request, response, next) => {
  // validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  // extract inputs
  const { email } = request.body;

  // check if the user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).exec();
    if (!existingUser) {
      return next(errorMessages.failedToFindUserError);
    }
  } catch (errorMessage) {
    return next(errorMessages.failedToFindUserError);
  }

  // generate a JWT token using the hashed password (contains id & email)
  let passwordResetToken;
  try {
    passwordResetToken = await generateForgotPasswordToken(
      existingUser.email,
      existingUser.id,
      existingUser.password
    );
  } catch (errorMessage) {
    return next(errorMessages.passwordResetFailedError);
  }

  // send the JWT token

  try {
    await sendResetEmail(existingUser.email, process.env.SENDGRID_EMAIL);
  } catch (errorMessage) {
    return next(errorMessages.passwordResetFailedError);
  }
  console.log(passwordResetToken)
  return response.status(201).json({
    message: "Succesfully sent forgot password email.",
  });
};


const changePassword = async (request, response, next) => {
  // validate inputs
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  // extract inputs
  const { email, newPassword, forgotPasswordToken } = request.body;

  // check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).exec();
    if (!existingUser) {
      return next(errorMessages.failedToFindUserError);
    }
  } catch (errorMessage) {
    return next(errorMessages.failedToFindUserError);
  }

  // validate the JWT token

  let resetTokenData;
  try {
    resetTokenData = verificationResetTokenIsValid(
      forgotPasswordToken,
      existingUser.password
    );
    if (!resetTokenData) {
      return next(errorMessages.passwordResetTokenVerifyError);
    }
  } catch (errorMessage) {
    return next(errorMessages.passwordResetTokenVerifyError);
  }
  console.log(resetTokenData)

  if (resetTokenData) {
    if (
      (resetTokenData.userEmail !== existingUser.email) |
      (resetTokenData.userId !== existingUser.id)
    ) {
      return next(errorMessages.passwordResetTokenVerifyError);
    }
  } else {
    return next(errorMessages.passwordResetTokenVerifyError);
  }

  // hash the new password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(newPassword)
  } catch (errorMessage) {
    return next(errorMessages.passwordResetTokenVerifyError);
  }

  // update the user
  try {
    await User.findByIdAndUpdate(existingUser.id, {
      password: hashedPassword
    })
  } catch (errorMessage) {
    console.log(errorMessage);
    return next(errorMessages.passwordResetTokenVerifyError);
  }

  return response.status(201).json({
    message: "Successfully updated the user password.",
  });
};



exports.createUser = createUser;
exports.resendEmailVerification = resendEmailVerification;
exports.confirmVerificationToken = confirmVerificationToken;
exports.loginUser = loginUser;
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
exports.changePassword = changePassword;