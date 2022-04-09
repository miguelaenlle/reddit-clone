const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  sub_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "subreddits",
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  post_time: {
    type: Date,
    required: true,
  },
  num_upvotes: {
    type: Number,
    required: true,
  },
  num_comments: {
    type: Number,
    required: true,
  },
  image_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "images",
    },
  ],
  comment_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "comments",
    },
  ],
});

postSchema.plugin(uniqueValidator);

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;
