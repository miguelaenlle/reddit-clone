const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");

const createComment = async (request, response, next) => {
  // params:
  // authToken (requires auth)
  // parentPostId (optional)
  // parentCommentId (optional)
  // parentIsPost
  // text
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken, parentPostId, parentCommentId, parentIsPost, text } =
    request.body;

  // verify the user token

  let userId;
  try {
    const decodedToken = await verifyLoginToken(authToken);
    if (!decodedToken) {
      return next(errorMessages.authTokenVerifyError);
    }

    userId = decodedToken.id;
  } catch (error) {
    console.log(error);
    return next(errorMessages.createCommentFailedError);
  }

  // get the user object

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
    return next(errorMessages.createCommentFailedError);
  }

  // make sure the parent exists
  let newComment;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    let inputs = {
      user_id: currentUser.id,
      parent_is_post: parentIsPost,
      date: new Date(),
      deleted: false,
      upvotes: 0,
      comment_content: text,
      comment_ids: [],
    };

    if (parentIsPost) {
      const parentPost = await Post.findById(parentPostId);
      if (!parentPost) {
        return next(errorMessages.getPostError);
      }
      inputs = { ...inputs, parent_post_id: parentPost.id };
    } else {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return next(errorMessages.getCommentFailedError);
      }
      inputs = { ...inputs, parent_post_id: parentComment.id };
    }
    newComment = new Comment(inputs);
    await newComment.save({ session });
    if (parentIsPost) {
      await Post.findByIdAndUpdate(
        parentPostId,
        {
          $push: {
            comment_ids: newComment.id,
          },
        },
        { session }
      );
    } else {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        {
          $push: {
            comment_ids: newComment.id,
          },
        },
        { session }
      );
    }
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return next(errorMessages.createCommentFailedError);
  }

  // save the comment

  return response.status(200).json({
    comment: newComment.toObject({ getters: true }),
    message: "Successfully created new comment",
  });
};
const getComment = async (request, response, next) => {
  // takes commentId via request.params
  const commentId = request.params.commentId;
  // params:
  // none

  // get the comment from the comments database

  let comment;
  try {
    comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorMessages.commentNotFoundError);
    }
  } catch {
    return next(errorMessages.getCommentFailedError);
  }

  return response.status(200).json({
    comment: comment.toObject({ getters: true }),
    message: "Successfully retrieved comment.",
  });
};
const getChildComments = async (request, response, next) => {
  // takes commentId via request.params
  // params:
  // none

  const commentId = request.params.commentId;

  let comment;
  try {
    comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorMessages.commentNotFoundError);
    }
  } catch {
    return next(errorMessages.getCommentFailedError);
  }

  let commentsChain = [];
  try {
    let commentData = await comment.populate("comment_ids");
    for (const recursionLevel in [...Array(10).keys()]) {
      let recursionQuery = "comment_ids"
      const accurateRecursionLevel = parseInt(recursionLevel) + 1
      console.log(accurateRecursionLevel);
      
      if (accurateRecursionLevel > 1) {

        recursionQuery = `${recursionQuery}${`.${recursionQuery}`.repeat(accurateRecursionLevel-1)}`
        console.log(recursionQuery);
      }
      console.log(commentData);
      commentData = await commentData.populate(recursionQuery)
    }
    commentsChain = commentData;
  } catch (error) {
    console.log(error);
  }

  return response.status(200).json({
    commentsChain,
    message: "Successfully retrieved child comments.",
  });
};
const updateComment = (request, response, next) => {
  // takes commentId via request.params
  // params:
  // authToken (requires auth)
  // newCommentContent

  // get the user
  // check that the commentId is in the user's comment_ids
  // update the commentContent with newCommentContent

  return response.status(200).json({
    message: "(PLACEHOLDER) Success.",
  });
};
const deleteComment = (request, response, next) => {
  // takes commentId via request.params
  // params:
  // authToken (requires auth)
  // voteDirection: 1 -> up, 0 -> neutral, -1 -> down

  // make sure the user exists
  // check that the commentId is in the user's comment_ids
  // update deleted to true

  return response.status(200).json({
    message: "(PLACEHOLDER) Success.",
  });
};
const voteComment = (request, response, next) => {
  // takes commentId via request.params
  // params:
  // authToken (requires auth)
  // voteDirection

  // make sure the user exists
  // pull user data
  // pull comment data
  // pull OP's (comment original poster's) user data

  // create new session
  // if user's votes exist
  // update the user's vote
  // else
  // add vote to user
  // get/take karma from OP
  // get/take karma from the comment
  return response.status(200).json({
    message: "(PLACEHOLDER) Success.",
  });
};

exports.createComment = createComment;
exports.getComment = getComment;
exports.getChildComments = getChildComments;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
exports.voteComment = voteComment;
