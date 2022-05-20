const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const HttpError = require("../models/http-error");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");

const updateSubredditInfo = async (request, response, next) => {
  // requires authentication (verify auth token)
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { newDescription } = request.body;
  const subId = request.params.subredditId;

  const userId = request.userData.userId;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
    const isVerified = existingUser.isVerified;
    if (!isVerified) {
      return next(errorMessages.notValidatedError);
    }
  } catch (errorMessage) {
    return next(errorMessages.authTokenVerifyError);
  }

  // get the subreddit

  let subreddit;
  try {
    subreddit = await Subreddit.findById(subId);
  } catch (error) {
    return next(errorMessages.subredditNotFoundError);
  }
  console.log(subreddit.sub_owner.toString(), existingUser._id.toString());
  if (subreddit.sub_owner.toString() !== existingUser._id.toString()) {
    return next(new HttpError("You do not own this subreddit", 403));
  }

  // update the subreddit
  try {
    await Subreddit.findByIdAndUpdate(subId, {
      description: newDescription,
    });
  } catch (error) {
    return next(new HttpError("Could not update subreddit", 500));
  }

  return response.status(200).json({
    message: "Subreddit description updated successfully",
  });
};

const createSubreddit = async (request, response, next) => {
  // requires authentication (verify auth JWT)
  // inputs: authToken, subreddit name, description
  // banner image
  // icon image 
  let iconFileInfo = ""
  let bannerFileInfo = ""

  try {
    iconFileInfo = request.files.icon[0].fieldname;
    bannerFileInfo = request.files.banner[0].fieldname;
  } catch {
    return next(errorMessages.invalidInputsError);
  }

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(errorMessages.invalidInputsError);
  }

  const { subName, description } = request.body;

  // validate the auth token
  const userId = request.userData.userId;
  console.log(userId);
  // find the user
  // make sure they are validated

  let existingUser;
  try {
    existingUser = await User.findById(userId);
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
    background_image_url: bannerFileInfo.path,
    picture_url: iconFileInfo.path,
    sub_owner: existingUser.id,
    post_ids: [],
    image_id: "test_id",
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
    console.log(subName, description);
    console.log("Save error", error);
    return next(errorMessages.subredditCreateError);
  }

  // add the subreddit to the user's list of subscribed subreddits
  try {
    await User.findByIdAndUpdate(userId, {
      $push: {
        sub_ids: newSubreddit._id,
      },
    });
  } catch (error) {
    console.log(error);
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

  const { page, numResults } = request.query;

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

  const { query, page, numResults } = request.query;
  let subredditSearchResults;

  try {
    subredditSearchResults = await Subreddit.find({
      name: {
        $regex: new RegExp(query.toLowerCase()),
      },
    })
      .skip(page * numResults)
      .limit(numResults);
  } catch (error) {
    console.log(error);
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
const joinSubreddit = async (request, response, next) => {
  const subId = request.params.subId;
  // inputs: authToken
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const userId = request.userData.userId;

  // find the logged in user & verify it exists
  let loggedInUser;
  try {
    loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return next(errorMessages.authTokenVerifyError);
    }

    if (!loggedInUser.isVerified) {
      return next(errorMessages.notValidatedError);
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

  const userId = request.userData.userId;

  // find the logged in user & verify it exists
  let loggedInUser;
  try {
    loggedInUser = await User.findById(userId);
    if (!loggedInUser) {
      return next(errorMessages.authTokenVerifyError);
    }
    if (!loggedInUser.isVerified) {
      return next(errorMessages.notValidatedError);
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

exports.updateSubredditInfo = updateSubredditInfo;
exports.createSubreddit = createSubreddit;
exports.searchForSubreddits = searchForSubreddits;
exports.getSubreddit = getSubreddit;
exports.getAllSubreddits = getAllSubreddits;
exports.joinSubreddit = joinSubreddit;
exports.leaveSubreddit = leaveSubreddit;
