const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  parent_post_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "posts",
  },
  parent_comment_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "comments",
  },
  parent_is_post: {
    type: Boolean,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: true,
  },
  upvotes: {
    type: Number,
    required: true,
  },
  comment_content: {
    type: String,
    required: true,
  },
  child_comments: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "comments",
    }
  ],
});

commentSchema.plugin(uniqueValidator);

const CommentModel = mongoose.model("comments", commentSchema);

module.exports = CommentModel;
