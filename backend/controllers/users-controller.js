const { validationResult } = require("express-validator");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const Post = require("../models/post");
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
    num_upvotes: designatedUser.num_upvotes,
    subreddits: designatedUser.sub_ids,
  };

  return response.status(200).json({
    message: "Succesfully retrieved user data",
    data: userData,
  });
};

const getUserSubreddits = async (request, response, next) => {
  const userId = request.params.uid;
  let designatedUser;
  try {
    designatedUser = await User.findById(userId);

    if (!designatedUser) {
      return next(errorMessages.failedToFindUserError);
    }
  } catch (error) {
    return response.status(404).json({
      message: "Failed to find the designated user.",
    });
  }

  console.log(designatedUser);

  designatedUser = await designatedUser.populate("sub_ids");
  const sub_ids = designatedUser.sub_ids;
  console.log(designatedUser);
  return response.status(200).json({
    message: "Succesfully retrieved user data",
    sub_ids,
  });
};

const getUserPosts = async (request, response, next) => {
  const userId = request.params.uid;
  let posts;
  try {
    posts = await Post.find({
      user_id: userId,
    }).sort({ post_time: -1 });
  } catch (error) {
    return response.status(404).json({
      message: "Failed to find the designated user.",
    });
  }

  return response.status(200).json({
    message: "Succesfully retrieved user data",
    posts: posts.map((post) => post.toObject({ getters: true })),
  });
};

const getUserComments = async (request, response, next) => {
  const userId = request.params.uid;
  let comments;
  try {
    comments = await Comment.find({
      user_id: userId,
    });
  } catch (error) {
    return response.status(404).json({
      message: "Failed to find the designated user.",
    });
  }

  return response.status(200).json({
    message: "Succesfully retrieved user data",
    comments: comments.map((comment) => comment.toObject({ getters: true })),
  });
};

const searchForUsers = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { searchQuery, page, numResults } = request.query;

  // page starts at 0
  // e.g. page 1 -> skip first 50 results, then limit to 50
  let searchResults;
  try {
    if (searchQuery) {
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
    } else {
      searchResults = await User.find()
        .skip(page * numResults)
        .limit(numResults);
    }
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

// const getSubreddits = async (request, response, next) => {
//   const errors = validationResult(request);
//   if (!errors.isEmpty()) {
//     return next(errorMessages.invalidInputsError);
//   }

//   const { authToken } = request.body;

//   // check token
//   let userId;
//   try {
//     const decodedToken = await verifyLoginToken(authToken);
//     if (!decodedToken) {
//       return next(errorMessages.authTokenVerifyError);
//     }
//     userId = decodedToken.id;
//   } catch {
//     return next(errorMessages.getUserSubsFailed);
//   }

//   // find the current user & extract subreddits
//   let subreddits;
//   try {
//     const currentUser = await User.findById(userId);
//     if (!currentUser) {
//       return next(errorMessages.failedToFindUserError);
//     }
//     subreddits = currentUser.sub_ids;
//   } catch {
//     return next(errorMessages.getUserSubsFailed);
//   }
//   return response.status(200).json({
//     subreddits: subreddits,
//     message: "Successfully retrieved user subreddits.",
//   });
// };

exports.getUserInformation = getUserInformation;
exports.searchForUsers = searchForUsers;
exports.getUserSubreddits = getUserSubreddits;
exports.getUserPosts = getUserPosts;
exports.getUserComments = getUserComments;
