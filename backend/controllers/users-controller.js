const { validationResult } = require("express-validator");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const User = require("../models/user");

const getUserInformation = async (request, response, next) => {
  const userId = request.params.uid;
  let designatedUser;
  try {
    designatedUser = await User.findById(userId).exec();
  } catch (error) {
    return response.status(404).json({
      message: "Failed to find the designated user.",
    });
  }

  const userData = {
    username: designatedUser.username,
    sub_ids: designatedUser.sub_ids,
    post_ids: designatedUser.post_ids,
    comment_ids: designatedUser.comment_ids,
    vote_ids: designatedUser.vote_ids,
  };

  return response.status(200).json({
    message: "Succesfully retrieved user data",
    data: userData,
  });
};

const searchForUsers = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { searchQuery, page, numResults } = request.body;

  // page starts at 0
  // e.g. page 1 -> skip first 50 results, then limit to 50
  let searchResults;
  try {
    searchResults = await User.find(
      {
        username: {
          $regex: new RegExp(searchQuery),
        },
        isVerified: true,
      },
      ["username", "num_upvotes"]
    )
      .skip(page * numResults)
      .limit(numResults);
  } catch (error) {
    return next(errorMessages.userSearchFailed);
  }

  return response.status(200).json({
    message: "Successfully pulled search results",
    data: searchResults.map((searchResult) =>
      searchResult.toObject({ getters: true })
    ),
  });
};

const getSubreddits = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken } = request.body;

  // check token
  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }
    userId = decodedToken.id;
  } catch {
    return next(errorMessages.getUserSubsFailed);
  }

  // find the current user & extract subreddits
  let subreddits;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(errorMessages.failedToFindUserError);
    }
    subreddits = currentUser.sub_ids;
  } catch {
    return next(errorMessages.getUserSubsFailed);
  }
  return response.status(200).json({
    subreddits: subreddits,
    message: "Successfully retrieved user subreddits.",
  });
};

exports.getUserInformation = getUserInformation;
exports.searchForUsers = searchForUsers;
exports.getSubreddits = getSubreddits;
