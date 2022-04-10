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

const passwordResetFailedError = new HttpError(
  "An error in the password reset occured, please try again.",
  500
);

const invalidPasswordError = new HttpError("Incorrect password", 422);

// users

const requestTooLargeError = new HttpError(
  "Request size too large, please request less results."
);

const searchFailedError = new HttpError("Search failed, please try again.");

const getUserSubsFailed = new HttpError(
  "Failed to retrieve user subreddits, please try again."
);

// subreddits

const authTokenVerifyError = new HttpError(
  "User verification failed, please try again.",
  500
);

const subredditCreateError = new HttpError(
  "Subreddit creation failed, please try again.",
  500
);

const uniqueNameError = new HttpError(
  "Please select a unique name for the subreddit.",
  422
);

const subNotFoundError = new HttpError("Subreddit not found.", 404);

const subFetchFailedError = new HttpError(
  "An error occured while fetching the subreddit, please try again.",
  500
);

const notValidatedError = new HttpError(
  "User has not confirmed their email.",
  401
);

const joinSubFailed = new HttpError(
  "Joining the subreddit failed, please try again.",
  500
);

const alreadyInSubError = new HttpError(
  "User is already a member of the subreddit.",
  401
);

const notInSubError = new HttpError(
  "User is not a member of the subreddit.",
  401
);

// posts

const postCreateError = new HttpError(
  "Failed to create the post, please try again.",
  500
);

const getPostsError = new HttpError("Failed to get all posts", 500);

const getPostError = new HttpError("Failed to get a post", 500);

const postNotFoundError = new HttpError("Failed to find the post.", 404);

const notUserPostError = new HttpError("You do not own this post.", 401);

const postUpdateFailedError = new HttpError(
  "Failed to update post, please try again.",
  500
);

const postDeletedError = new HttpError("Post is deleted.", 401);

const postDeleteFailedError = new HttpError(
  "Failed to delete post, please try again.",
  500
);

const postVoteFailedError = new HttpError("Failed to vote on post", 500);

// comments

const createCommentFailedError = new HttpError("Failed to create comment", 500)

const getCommentFailedError = new HttpError("Failed to get comment", 500)

const commentNotFoundError = new HttpError("Failed to get comment", 404)

module.exports = {
  invalidInputsError,
  userExistsError,
  usernameExistsError,
  signupFailedError,
  failedToFindUserError,
  userIsVerifiedError,
  authTokenVerifyError,
  getUserSubsFailed,
  loginFailedError,
  invalidPasswordError,
  passwordResetFailedError,
  requestTooLargeError,
  searchFailedError,
  subredditCreateError,
  subNotFoundError,
  subFetchFailedError,
  notValidatedError,
  uniqueNameError,
  joinSubFailed,
  alreadyInSubError,
  notInSubError,
  postCreateError,
  getPostsError,
  getPostError,
  postNotFoundError,
  notUserPostError,
  postUpdateFailedError,
  postDeletedError,
  postDeleteFailedError,
  postVoteFailedError,
  createCommentFailedError,
  getCommentFailedError,
  commentNotFoundError
};
