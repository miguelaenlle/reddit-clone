const mongoose = require("mongoose");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const Vote = require("../models/vote");
const errorMessages = require("../constants/errors");
const createNewPost = async (request, response, next) => {
  // needs:
  // authToken
  // subId
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
  } catch (error) {
    console.log(error);
    return next(errorMessages.postCreateError);
  }

  // pull user object
  let currentUser;
  try {
    currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(errorMessages.authTokenVerifyError);
    }
    if (!currentUser.isVerified) {
      return next(errorMessages.notValidatedError);
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
    deleted: false,
    image_ids: [],
    comment_ids: [],
  });

  // in a session

  // create the post
  // add the post to the user's list of posts

  try {
    await newPost.save();
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
  // needs: query (optional), subId (optional), page, numResults, sortMode (per page) (no auth)
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { query, subId, page, numResults, sortMode } = request.body;

  // pull all posts

  let posts;
  try {
    // types of sortMode
    // top -- sort by upvotes
    // new -- sort by date (descending)
    // old -- sort by date (ascending)
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

    let searchQuery;
    if (query) {
      searchQuery = {
        $or: [
          {
            title: {
              $regex: new RegExp(query.toLowerCase()),
            },
          },
          {
            text: {
              $regex: new RegExp(query.toLowerCase()),
            },
          },
        ],
      };
    }
    if (subId) {
      if (searchQuery) {
        const oldSearchQuery = searchQuery;
        searchQuery = {
          $and: [
            oldSearchQuery,
            {
              sub_id: subId,
              deleted: false,
            },
          ],
        };
      } else {
        searchQuery = {
          sub_id: subId,
          deleted: false,
        };
      }
    } else {
      searchQuery = {
        $and: [searchQuery, { deleted: false }],
      };
    }
    console.log(searchQuery);
    posts = await Post.find(searchQuery)
      .sort(sortFilter)
      .skip(page * numResults)
      .limit(numResults);
  } catch (error) {
    console.log(error);
    return next(errorMessages.getPostsError);
  }

  // return posts
  return response.status(200).json({
    posts: posts.map((post) => post.toObject({ getters: true })),
    message: "Successfully retrieved posts.",
  });
};

const getPost = async (request, response, next) => {
  // pull the postId from the URL
  const postId = request.params.postId;
  // needs: none (no auth)

  // pull the data for a single post
  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return next(errorMessages.getPostError);
    }
  } catch {
    return next(errorMessages.getPostError);
  }

  // return it

  return response.status(200).json({
    post: post.toObject({ getters: true }),
    message: "Successfully retrieved post.",
  });
};

const updatePost = async (request, response, next) => {
  const postId = request.params.postId;
  // pull the postId from the url

  // needs:
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { authToken, newTitle, newText } = request.body;

  // authToken (authorization required)
  // newTitle
  // newText

  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedToken.id;
  } catch {
    return next(errorMessages.postUpdateFailedError);
  }

  // make sure the user exists

  // pull the posts objects for the given user
  let posts;
  try {
    posts = await Post.find({
      user_id: userId,
    });
  } catch (error) {
    console.log(error);
    return next(errorMessages.postUpdateFailedError);
  }

  // check if postId is actually the User's post
  if (posts && !posts.map((post) => post.id.toString()).includes(postId)) {
    return next(errorMessages.notUserPostError);
  }

  // pull the post object
  // make sure deleted == false

  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return next(errorMessages.postNotFoundError);
    }
    if (post.deleted) {
      return next(errorMessages.postDeletedError);
    }
  } catch {
    return next(errorMessages.postUpdateFailedError);
  }

  // update info:
  // if oldTitle != newTitle -> update it else undefined
  // if oldDescription != newDescription -> update it else undefined

  try {
    await Post.findByIdAndUpdate(postId, {
      title: newTitle,
      text: newText,
    });
  } catch {
    return next(errorMessages.postUpdateFailedError);
  }

  return response.status(200).json({
    message: "Successfully updated post.",
  });
};

const deletePost = async (request, response, next) => {
  // pull the postId from the url
  const postId = request.params.postId;
  // needs:
  // authToken (authorization required)
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }
  const { authToken } = request.body;

  // make sure the user exists
  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedToken.id;
  } catch {
    return next(errorMessages.postUpdateFailedError);
  }
  // pull the user's User object

  let posts;
  try {
    posts = await Post.find({
      user_id: userId,
    });
  } catch (error) {
    console.log(error);
    return next(errorMessages.postUpdateFailedError);
  }

  // check if postId is actually the User's post
  if (posts && !posts.map((post) => post.id.toString()).includes(postId)) {
    return next(errorMessages.notUserPostError);
  }

  // pull the post
  // make sure it isn't deleted

  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return next(errorMessages.postNotFoundError);
    }
    if (post.deleted) {
      return next(errorMessages.postDeletedError);
    }
  } catch {
    return next(errorMessages.postDeleteFailedError);
  }

  // in session:
  // delete the post
  // delete the postId from the user object
  try {
    await Post.findByIdAndUpdate(post.id, {
      deleted: true,
    });
  } catch {
    return next(errorMessages.postDeleteFailedError);
  }
  return response.status(200).json({
    message: "Post successfully deleted.",
  });
};
const getPostComments = async (request, response, next) => {
  // takes postId via request.params
  // params:
  // none

  const postId = request.params.postId;

  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return next(errorMessages.postNotFoundError);
    }
  } catch {
    return next(errorMessages.getPostError);
  }

  let commentsChain = [];
  try {
    let commentData = await post.populate("comment_ids");
    for (const recursionLevel in [...Array(10).keys()]) {
      let recursionQuery = "comment_ids";
      const accurateRecursionLevel = parseInt(recursionLevel) + 1;
      console.log(accurateRecursionLevel);

      if (accurateRecursionLevel > 1) {
        recursionQuery = `${recursionQuery}${`.${recursionQuery}`.repeat(
          accurateRecursionLevel - 1
        )}`;
        console.log(recursionQuery);
      }
      console.log(commentData);
      commentData = await commentData.populate(recursionQuery);
    }
    commentsChain = commentData;
  } catch (error) {
    console.log(error);
    return next(errorMessages.getChildCommentsFailedError);
  }

  return response.status(200).json({
    commentsChain: commentsChain.comment_ids,
    message: "Successfully retrieved child comments.",
  });
};

const voteOnPost = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  // pull the postId from the url
  const postId = request.params.postId;

  // needs:
  // authToken: (authorization required)
  // voteDirection: 1 -> up, 0 -> neutral, -1 -> down
  const { authToken, voteDirection } = request.body;

  // make sure the user exists

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
    return next(errorMessages.voteFailedError);
  }

  // pull the user data
  let currentUser;
  try {
    currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(errorMessages.authTokenVerifyError);
    }
    if (!currentUser.isVerified) {
      return next(errorMessages.notValidatedError);
    }
  } catch (error) {
    console.log(error);
    return next(errorMessages.voteFailedError);
  }

  // pull the post data
  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      return next(errorMessages.getPostError);
    }
    if (post.deleted) {
      return next(errorMessages.postDeletedError);
    }
  } catch {
    return next(errorMessages.voteFailedError);
  }

  // pull the post's user data
  // doesn't exist -> okay, just won't give OP karma
  let opUser;
  try {
    if (post.user_id.toString() !== currentUser.id) {
      opUser = await User.findById(post.user_id);
    }
  } catch {}

  // create new session
  // initiate numToChange to 0
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    // console.log(currentUser);
    const userVoteObjects = await Vote.find({
      user_id: currentUser.id,
      parent_post_id: post.id,
    });
    const matchingVotes = userVoteObjects.filter(
      (object) => object.parent_post_id.toString() === post.id
    );
    // update the user's vote
    console.log(matchingVotes);
    let voteChange = 0;

    if (matchingVotes.length > 0) {
      const vote = matchingVotes[0];
      const initialVoteValue = vote.vote_value;
      //   voteChange = voteDirection - initialVoteValue;
      if (initialVoteValue === voteDirection) {
        // no change
        voteChange = 0;
      } else if (initialVoteValue === -1) {
        // -1 -> 1 +2 0 - -2 = +2
        // -1 -> 0 +1 0 - -1 = +1
        voteChange = voteDirection - initialVoteValue;
      } else if (initialVoteValue === 1) {
        // 1 -> -1 -2   -1 - 1 = -2
        // 1 -> 0 -1    -1 - 0 = -1
        voteChange = voteDirection - initialVoteValue;
      } else if (initialVoteValue === 0) {
        // 0 -> 1 +1
        // 0 -> -1 -1
        voteChange = voteDirection;
      }
      console.log("updating pre-existing vote");
      await Vote.findByIdAndUpdate(
        vote.id,
        {
          vote_value: voteDirection,
        },
        { session: session }
      );
    } else {
      const vote = new Vote({
        user_id: currentUser.id,
        parent_post_id: post.id,
        parent_is_post: true,
        vote_value: voteDirection,
      });
      // add the vote to the user
      await vote.save({ session });
      // await User.findByIdAndUpdate(
      //   currentUser.id,
      //   {
      //     $push: {
      //       vote_ids: vote.id,
      //     },
      //   },
      //   { session }
      // );
      console.log("Created a new vote for the user");
      voteChange = voteDirection;
    }

    // get/take karma from OP
    if (voteChange !== 0) {
      if (opUser) {
        console.log(`Give OP ${voteChange} karma`);
        await User.findByIdAndUpdate(
          opUser.id,
          {
            num_upvotes: opUser.num_upvotes + voteChange,
          },
          { session }
        );
      }
      // get/take total upvotes from the post
      console.log(`Give post ${voteChange} karma`);
      await Post.findByIdAndUpdate(
        post.id,
        {
          num_upvotes: post.num_upvotes + voteChange,
        },
        { session }
      );
    }
    await session.commitTransaction();
  } catch {
    return next(errorMessages.voteFailedError);
  }
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

  return response.status(201).json({
    message: "Successfully voted on post.",
  });
};

exports.createNewPost = createNewPost;
exports.getAllPosts = getAllPosts;
exports.getPost = getPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPostComments = getPostComments;
exports.voteOnPost = voteOnPost;
