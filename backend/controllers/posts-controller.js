const mongoose = require("mongoose");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const errorMessages = require("../constants/errors");

const createNewPost = async (request, response, next) => {
  // needs:
  // authToken
  // subId
  // title
  // text
  // images (array of urls)

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken, subId, title, text } = request.body;

  // requires authentication
  let userId;
  try {
    decodedAuthToken = await verifyLoginToken(authToken);
    if (!decodedAuthToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedAuthToken.id;
    if (!userId) {
      return next(errorMessages.authTokenVerifyError);
    }
  } catch {
    return next(errorMessages.postCreateError);
  }

  // pull user object
  let currentUser;
  try {
    currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(errorMessages.authTokenVerifyError);
    }
  } catch (error) {
    console.log(error);
    return next(errorMessages.postCreateError);
  }

  // pull subreddit and validate it exists
  let subreddit;
  try {
    subreddit = await Subreddit.findById(subId);
    if (!subreddit) {
      return next(errorMessages.subNotFoundError);
    }
  } catch {
    return next(errorMessages.postCreateError);
  }

  // create the post using the inputs

  const currentDate = new Date();

  const newPost = new Post({
    sub_id: subreddit.id,
    user_id: currentUser.id,
    title: title,
    text: text,
    post_time: currentDate,
    num_upvotes: 0,
    num_comments: 0,
    image_ids: [],
    comment_ids: [],
  });

  // in a session

  // create the post
  // add the post to the user's list of posts

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await newPost.save({ session });
    await User.findByIdAndUpdate(
      currentUser.id,
      {
        $push: {
          post_ids: newPost.id,
        },
      },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(errorMessages.postCreateError);
  }

  return response.status(200).json({
    id: newPost.id,
    title: newPost.title,
    text: newPost.text,
    message: "Successfully created new post.",
  });
};

const getAllPosts = async (request, response, next) => {
  // needs: page, numResults (per page) (no auth)

  // pull all posts

  // return posts

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

const getSubPosts = async (request, response, next) => {
  // needs: query, page, numResults (per page) (no auth)

  // pull posts given query, page, and results per page

  // return results

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

const getPost = async (request, response, next) => {
  // pull the postId from the URL
  // needs: none (no auth)

  // pull the data for a single post

  // return it

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

const updatePost = async (request, response, next) => {
  // pull the postId from the url

  // needs:

  // authToken (authorization required)
  // newTitle
  // newDescription

  // make sure the user exists
  // pull the user's User object
  // check if postId is actually the User's post
  // update info:
  // if oldTitle != newTitle -> update it else undefined
  // if oldDescription != newDescription -> update it else undefined

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

const deletePost = async (request, response, next) => {
  // pull the postId from the url
  // needs:
  // authToken (authorization required)

  // make sure the user exists
  // pull the user's User object
  // check if postId is actually the User's post

  // in session:
  // delete the post
  // delete the postId from the user object

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};
const getPostComments = async (request, response, next) => {
  // WIP, wait for me to make the Comments system
  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

const updatePostVote = async (request, response, next) => {
  // pull the postId from the url
  // needs:
  // authToken: (authorization required)
  // voteDirection: 1 -> up, 0 -> neutral, -1 -> down

  // make sure the user exists

  // pull the user data

  // pull the post data

  // pull the post's user data
  // doesn't exist -> okay, just won't give OP karma

  // create new session
  // initiate numToChange to 0

  // populate user voteIds
  // postId in voteIds.map(... .postId)
  // pull that object
  // update the object with new voteDirection IN SESSION
  // store numToChange post & user by based on the new vote direction vs. the old one

  // else
  // create a new vote() given the input IN SESSION
  // store numToChange post & user by as the voteDirection

  // in the session
  // add +numToChange karma to the post's num_upvotes tally
  // add +numToCHange karma to OP's num_upvotes tally

  // execute session

  return response.status(200).json({
    message: "(SAMPLE) Request successful.",
  });
};

exports.createNewPost = createNewPost;
exports.getAllPosts = getAllPosts;
exports.getSubPosts = getSubPosts;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPostComments = getPostComments;
exports.updatePostVote = updatePostVote;
