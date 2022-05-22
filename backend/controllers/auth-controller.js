const { validationResult } = require("express-validator");

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
const sendPasswordResetEmail = require("../util/mail/send-password-reset-email");

const createUser = async (request, response, next) => {
  console.log(request.body);
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(errorMessages.invalidInputsError);
  }
  const { username, email, password } = request.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (errorMessage) {
    return response.status(409).json({
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
      return response.status(409).json({
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
  } catch (errorMessage) {
    const error = errorMessages.signupFailedError;
    next(error);
  }

  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
    isVerified: false,
    pfp_url: "",
    num_upvotes: 0,
    sub_ids: [],
    post_ids: [],
    comment_ids: [],
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
    return next(errorMessages.invalidInputsError);
  }
  const { email } = request.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return next(errorMessages.failedToFindUserError);
    }
  } catch (error) {
    return next(errorMessages.failedToFindUserError);
  }

  if (existingUser.isVerified) {
    return next(errorMessages.userIsVerifiedError);
  }

  let signupToken;
  try {
    signupToken = await generateSignupToken(existingUser.id);
    console.log(signupToken);
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
    const decodedToken = await verificationTokenIsValid(verificationToken);
    console.log(decodedToken);
    userId = decodedToken.userId;
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
  }
  let existingUser;
  if (!userId) {
    return next(errorMessages.authTokenVerifyError);
  }
  try {
    existingUser = await User.findById(userId);
  } catch (errorMessage) {
    return next(errorMessages.failedToFindUserError);
  }
  console.log(existingUser);

  if (!existingUser) {
    return next(errorMessages.failedToFindUserError);
  }
  if (existingUser.isVerified) {
    return next(errorMessages.userIsVerifiedError);
  }

  try {
    await User.findByIdAndUpdate(existingUser.id, { isVerified: true });
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
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
    existingUser = await User.findOne({ email: email });
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
    let signupToken;
    try {
      signupToken = await generateSignupToken(existingUser.id);
      console.log(signupToken);
    } catch (errorMessage) {
      return next(errorMessages.signupFailedError);
    }
    try {
      await sendVerificationEmail(
        email,
        process.env.SENDGRID_EMAIL,
        signupToken
      );
      return response.status(401).json({
        message: "Please validate your email.",
      });
    } catch (errorMessage) {
      return next(errorMessages.signupFailedError);
    }
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
    username: existingUser.username,
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
    await sendPasswordResetEmail(
      existingUser.email,
      process.env.SENDGRID_EMAIL,
      passwordResetToken,
      existingUser.id
    );
  } catch (errorMessage) {
    return next(errorMessages.passwordResetFailedError);
  }
  console.log(passwordResetToken);
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
  const { userId, newPassword, forgotPasswordToken } = request.body;

  // check if user exists
  let existingUser;
  try {
    existingUser = await User.findById(userId).exec();
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
    console.log(resetTokenData);
    console.log(existingUser.password);
    console.log(forgotPasswordToken);
    if (!resetTokenData) {
      return next(errorMessages.authTokenVerifyError);
    }
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
  }

  if (resetTokenData) {
    if (
      (resetTokenData.userEmail !== existingUser.email) |
      (resetTokenData.userId !== existingUser.id)
    ) {
      return next(errorMessages.authTokenVerifyError);
    }
  } else {
    return next(errorMessages.authTokenVerifyError);
  }

  // hash the new password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(newPassword);
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
  }

  // update the user
  try {
    await User.findByIdAndUpdate(existingUser.id, {
      password: hashedPassword,
    });
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
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
