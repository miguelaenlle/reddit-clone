const { response } = require("express");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");

const createSubreddit = async (request, response, next) => {
  // requires authentication (verify auth JWT)
  // inputs: authToken, subreddit name, description

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken, subName, description } = request.body;

  // validate the auth token
  let decodedAuthToken;
  try {
    decodedAuthToken = await verifyLoginToken(authToken); // contains id and email
  } catch (error) {
    return next(errorMessages.authTokenVerifyError);
  }

  // find the user
  // make sure they are validated

  let existingUser;
  try {
    existingUser = await User.findById(decodedAuthToken.id);
    const isVerified = existingUser.isVerified;
    if (!isVerified) {
      return next(errorMessages.notValidatedError);
    }
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
  }

  // create the subreddit
  const newSubreddit = new Subreddit({
    name: subName,
    description: description,
    num_members: 0,
    background_image_url: "",
    picture_url: "",
    post_ids: [],
  });

  // make sure the subreddit doesn't exist yet
  try {
    const subredditWithName = await Subreddit.find({ name: newSubreddit.name });
    if (subredditWithName && subredditWithName.length > 0) {
      return next(errorMessages.uniqueNameError);
    }
  } catch (errorMessage) {
    console.log(errorMessage);
    return next(errorMessages.subredditCreateError);
  }

  try {
    await newSubreddit.save();
  } catch (error) {
    return next(errorMessages.subredditCreateError);
  }

  // add the subreddit to the user's list of subscribed subreddits
  try {
    await User.findByIdAndUpdate(decodedAuthToken.id, {
      $push: {
        sub_ids: newSubreddit._id,
      },
    });
  } catch (error) {
    return next(errorMessages.subredditCreateError);
  }

  return response.status(200).json({
    data: {
      sub_name: newSubreddit.name,
      sub_description: newSubreddit.description,
      sub_id: newSubreddit.id,
    },
    message: "Subreddit succesfully created.",
  });
};

const getAllSubreddits = async (request, response, next) => {
  // inputs: page, numResults (per page)

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { page, numResults } = request.body;

  let subredditSearchResults;

  try {
    subredditSearchResults = await Subreddit.find()
      .sort("name")
      .skip(page * numResults)
      .limit(numResults);
  } catch (error) {
    return next(errorMessages.searchFailedError);
  }

  return response.status(200).json({
    results: subredditSearchResults.map((result) =>
      result.toObject({ getters: true })
    ),
    message: "Successfully retrived subreddits",
  });
};

const searchForSubreddits = async (request, response, next) => {
  // inputs: query, page, numResults (per page)

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { query, page, numResults } = request.body;

  let subredditSearchResults;

  try {
    subredditSearchResults = await Subreddit.find({
      name: {
        $regex: new RegExp(query),
      },
    })
      .skip(page * numResults)
      .limit(numResults);
  } catch (error) {
    return next(errorMessages.searchFailedError);
  }

  return response.status(200).json({
    results: subredditSearchResults.map((result) =>
      result.toObject({ getters: true })
    ),
    message: "Successfully retrived subreddits",
  });
};

const getSubreddit = async (request, response, next) => {
  const subId = request.params.subId;
  // inputs: subId (url), no JSON params

  // find the subreddit for the subId
  let subreddit;
  try {
    subreddit = await Subreddit.findById(subId);
    if (!subreddit) {
      return next(errorMessages.subNotFoundError);
    }
  } catch (error) {
    return next(errorMessages.subNotFoundError);
  }

  return response.status(200).json({
    data: subreddit.toObject({ getters: true }),
    message: "Successfully fetched the subreddit.",
  });
};

const getSubredditPosts = async (request, response, next) => {
  // leave until you build the Post object
  const subId = request.params.subId;
  // inputs: query, page, numResults (per page)
  const { query, page, numResults } = request.body;

  return response.status(200).json({
    message: "(PLACEHOLDER) request succeeded.",
  });
};

const joinSubreddit = async (request, response, next) => {
  const subId = request.params.subId;
  // inputs: authToken
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { authToken } = request.body;
  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedToken.id;
  } catch {
    return next(errorMessages.joinSubFailed);
  }
  // find the logged in user & verify it exists
  let loggedInUser;
  try {
    loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return next(errorMessages.authTokenVerifyError);
    }
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  // check if the subreddit exists
  let subreddit;
  try {
    subreddit = await Subreddit.findById(subId);
    if (!subreddit) {
      return next(errorMessages.subNotFoundError);
    }
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  // make sure the user isn't a member of the subreddit already
  if (loggedInUser.sub_ids.includes(subreddit.id)) {
    return next(errorMessages.alreadyInSubError);
  }

  // add the subreddit to the user's list of joined subreddits
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          sub_ids: subreddit.id,
        },
      },
      {
        session: session,
      }
    );
    await Subreddit.findByIdAndUpdate(
      subId,
      {
        num_members: subreddit.num_members + 1,
      },
      {
        session: session,
      }
    );
    session.commitTransaction();
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  return response.status(200).json({
    sub_id: subId,
    message: "Successfully joined subreddit.",
  });
};

const leaveSubreddit = async (request, response, next) => {
  const subId = request.params.subId;

  // inputs: authToken
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { authToken } = request.body;
  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedToken.id;
  } catch {
    return next(errorMessages.joinSubFailed);
  }
  // find the logged in user & verify it exists
  let loggedInUser;
  try {
    loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return next(errorMessages.authTokenVerifyError);
    }
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  // check if the subreddit exists
  let subreddit;
  try {
    subreddit = await Subreddit.findById(subId);
    if (!subreddit) {
      return next(errorMessages.subNotFoundError);
    }
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  // make sure the user is a member of the subreddit already
  if (!loggedInUser.sub_ids.includes(subreddit.id)) {
    return next(errorMessages.notInSubError);
  }

  // remove the subreddit from the user's list of joined subreddits
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          sub_ids: subreddit.id,
        },
      },
      {
        session: session,
      }
    );
    if (subreddit.num_members > 0) {
      await Subreddit.findByIdAndUpdate(
        subId,
        {
          num_members: subreddit.num_members - 1,
        },
        {
          session: session,
        }
      );
    }
    session.commitTransaction();
  } catch {
    return next(errorMessages.joinSubFailed);
  }

  return response.status(200).json({
    sub_id: subId,
    message: "Successfully left subreddit.",
  });
};

exports.createSubreddit = createSubreddit;
exports.searchForSubreddits = searchForSubreddits;
exports.getSubreddit = getSubreddit;
exports.getSubredditPosts = getSubredditPosts;
exports.getAllSubreddits = getAllSubreddits;
exports.joinSubreddit = joinSubreddit;
exports.leaveSubreddit = leaveSubreddit;
