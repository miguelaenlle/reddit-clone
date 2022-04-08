const { validationResult } = require("express-validator");
const errorMessages = require("../constants/errors");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const atlasPlugin = require("mongoose-atlas-search");

const getUserInformation = async (request, response, next) => {
  const userId = request.params.uid;
  const errors = validationResult(request);
  // verify the inputs -- just userID
  if (!errors.isEmpty()) {
    return errorMessages.invalidInputsError;
  }

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
    email: designatedUser.email,
  }; // eventually include posts, votes, etc here

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
  const searchResults = await User.find(
    {
      username: {
        $regex: new RegExp(searchQuery),
      },
    },
    {
      _id: 0,
      __v: 0,
    }
  );

  return response.status(200).json({
    message: "Successfully pulled search results",
    data: searchResults,
  });
};

exports.getUserInformation = getUserInformation;
exports.searchForUsers = searchForUsers;
