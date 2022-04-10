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
  // authToken (optional -- filters by subbed subreddits only)
  // sortMode -- the method of sorting: top, old, new
  // page -- current page
  // numResults (per page) -- num results per page
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken, sortMode, page, numResults } = request.body;
  let subreddits = [];
  if (authToken) {
    // decrypt the token
    try {
      decodedAuthToken = await verifyLoginToken(authToken);
      const userId = decodedAuthToken.id;
      currentUser = await User.findById(userId);
      console.log(currentUser);
      if (currentUser) {
        subreddits = currentUser.sub_ids;
      }
    } catch {}
  }

  let sortFilter = {};
  if (sortMode === "top") {
    sortFilter = {
      num_upvotes: -1,
    };
  } else if (sortMode === "controversial") {
    sortFilter = {
      num_upvotes: 1,
    };
  } else if (sortMode === "new") {
    sortFilter = {
      post_time: -1,
    };
  } else if (sortMode === "old") {
    sortFilter = {
      post_time: 1,
    };
  }
  let posts;
  if (subreddits && subreddits.length > 0) {
    // subreddit-filtered pull
    const searchQuery = {
      sub_id: { $in: subreddits },
    };

    posts = await Post.find(searchQuery)
      .sort(sortFilter)
      .skip(page * numResults)
      .limit(numResults);
  } else {
    posts = await Post.find()
      .sort(sortFilter)
      .skip(page * numResults)
      .limit(numResults);
  }
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
