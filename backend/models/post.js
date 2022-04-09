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
  text: {
    type: String,
    required: false,
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
      type: String,
      required: true,
    }
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
