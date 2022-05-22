const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
const Vote = require("../models/vote");

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

  const { parentPostId, parentCommentId, parentIsPost, text } = request.body;

  // verify the user token

  const userData = request.userData;
  const userId = userData.userId;

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
      inputs = { ...inputs, parent_comment_id: parentComment.id };
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
  // takes sortMode via request.query
  // ?sortMode=new, controversial, etc

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
    let commentData = await comment.populate({
      path: "comment_ids",
    });
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
      commentData = await commentData.populate({
        path: recursionQuery,
      });
      commentData = await commentData.populate(`${recursionQuery}.user_id`);
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
const updateComment = async (request, response, next) => {
  // takes commentId via request.params
  const commentId = request.params.commentId;
  // params:
  // authToken (requires auth)
  // newCommentContent

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { newCommentContent } = request.body;

  // verify the user token

  const userId = request.userData.userId;

  // get the user

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
    return next(errorMessages.updateCommentFailedError);
  }

  // check that the commentId is in the user's comment_ids
  try {
    let userComments = await Comment.find({
      user_id: currentUser.id,
    });
    userComments = userComments.map((comment) => comment.id.toString());
    console.log(userComments, commentId);
    if (!userComments.includes(commentId)) {
      return next(errorMessages.notUserCommentError);
    }
  } catch (error) {
    console.log(error);
    return next(errorMessages.updateCommentFailedError);
  }

  // update the commentContent with newCommentContent
  try {
    await Comment.findByIdAndUpdate(commentId, {
      comment_content: newCommentContent,
    });
  } catch {
    return next(errorMessages.updateCommentFailedError);
  }

  return response.status(200).json({
    message: "Successfully updated the comment.",
  });
};
const deleteComment = async (request, response, next) => {
  // takes commentId via request.params
  const commentId = request.params.commentId;
  // params:
  // authToken (requires auth)

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { authToken } = request.body;

  // make sure the user exists

  const userId = request.userData.userId;

  // get the user

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
    return next(errorMessages.deleteCommentFailedError);
  }

  // check that the commentId is in the user's comment_ids
  try {
    let userComments = await Comment.find({
      user_id: currentUser.id,
    });
    userComments = userComments.map((comment) => comment.id.toString());
    console.log(userComments, commentId);
    if (!userComments.includes(commentId)) {
      return next(errorMessages.notUserCommentError);
    }
  } catch (error) {
    console.log(error);
    return next(errorMessages.deleteCommentFailedError);
  }

  // update deleted to true
  try {
    await Comment.findByIdAndUpdate(commentId, {
      deleted: true,
    });
  } catch {
    return next(errorMessages.deleteCommentFailedError);
  }

  // find the post and subtract one from its comments_count

  return response.status(200).json({
    message: "Successfully deleted the comment.",
  });
};

const getVoteDirection = async (request, response, next) => {
  // takes commentId via request.params
  const commentId = request.params.commentId;

  const userId = request.userData.userId;
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

  const userVoteObjects = await Vote.find({
    user_id: currentUser.id,
    parent_comment_id: commentId,
  });

  const matchingVotes = userVoteObjects.filter(
    (object) => object.parent_comment_id.toString() === commentId
  );

  if (matchingVotes.length > 0) {
    const vote = matchingVotes[0];
    const initialVoteValue = vote.vote_value;
    return response.status(200).json({
      voteDirection: initialVoteValue,
      message: "Successfully retrieved vote direction.",
    });
  } else {
    return response.status(200).json({
      voteDirection: 0,
      message: "Successfully retrieved vote direction.",
    });
  }
};

const voteComment = async (request, response, next) => {
  // takes commentId via request.params
  const commentId = request.params.commentId;

  // params:
  // authToken (requires auth)
  // voteDirection

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return next(errorMessages.invalidInputsError);
  }

  const { voteDirection } = request.body;

  // make sure the user exists

  const userId = request.userData.userId;
  // pull user data

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

  // pull comment data

  let comment;
  try {
    comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorMessages.getCommentFailedError);
    }
    if (comment.deleted) {
      return next(errorMessages.createCommentFailedError);
    }
  } catch {
    return next(errorMessages.voteFailedError);
  }

  // pull OP's (comment original poster's) user data

  let opUser;
  try {
    if (comment.user_id.toString() !== currentUser.id) {
      opUser = await User.findById(comment.user_id);
    }
  } catch {}

  // create new session
  // if user's votes exist
  // update the user's vote
  // else
  // add vote to user
  // get/take karma from OP
  // get/take karma from the comment

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    // console.log(currentUser);
    const userVoteObjects = await Vote.find({
      user_id: currentUser.id,
      parent_comment_id: comment.id,
    });
    const matchingVotes = userVoteObjects.filter(
      (object) => object.parent_comment_id.toString() === comment.id
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
        parent_comment_id: comment.id,
        parent_is_post: false,
        vote_value: voteDirection,
      });
      await vote.save({ session });
      console.log("Created a new vote for the user");
      voteChange = voteDirection;
    }

    if (voteChange !== 0) {
      if (opUser) {
        await User.findByIdAndUpdate(
          opUser.id,
          {
            num_upvotes: opUser.num_upvotes + voteChange,
          },
          { session }
        );
      }
      console.log(`Give comment ${voteChange} karma`);
      await Comment.findByIdAndUpdate(
        comment.id,
        {
          upvotes: comment.upvotes + voteChange,
        },
        { session }
      );
    }
    await session.commitTransaction();
  } catch {
    return next(errorMessages.voteFailedError);
  }

  return response.status(200).json({
    message: "Successfully voted on comment.",
  });
};

exports.createComment = createComment;
exports.getComment = getComment;
exports.getChildComments = getChildComments;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
exports.voteComment = voteComment;
exports.getVoteDirection = getVoteDirection;
