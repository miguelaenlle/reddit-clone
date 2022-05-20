const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
const Vote = require("../models/vote");

const getFeedPosts = async (request, response, next) => {
  // params:
  // sortMode -- the method of sorting: top, old, new
  // page -- current page
  // numResults (per page) -- num results per page
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { sortMode, page, numResults } = request.query;
  console.log(page, numResults)
  let sortFilter = {};
  if (sortMode === "top") {
    sortFilter = {
      num_upvotes: -1,
    };
  } else if (sortMode === "controversial") {
    console.log("Controversial")
    sortFilter = {
      num_upvotes: 1,
    };
  } else if (sortMode === "new") {
    sortFilter = {
      post_time: -1
    };
  } else if (sortMode === "old") {
    sortFilter = {
      post_time: 1,
    };
  }

  const oldFilter = sortFilter;
  const deletedFilter = {
    deleted: false,
  }
  const newFilter = {
    $and: [oldFilter, deletedFilter]
  }

  
  const posts = await Post.find({deleted: false})
    .sort(sortFilter)
    .skip(page * numResults)
    .limit(numResults)
    .populate("user_id")
    .populate("sub_id")
  // console.log(posts);
  // if subreddits
  // pull first N with subredditId in subreddit IDS
  // sort by date
  // else
  // pull first N + page
  // sort by date

  return response.status(200).json({
    posts: posts.map((post) => post.toObject({ getters: true })),
    message: "Successful call.",
  });
};

exports.getFeedPosts = getFeedPosts;
