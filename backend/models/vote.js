const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const voteSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  parent_post_id: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "posts",
  },
  parent_comment_id: {
    type: mongoose.Types.ObjectId,
    required: false,
    ref: "comments",
  },
  parent_is_post: {
    type: Boolean,
    required: true,
  },
  vote_value: {
    type: Number,
    required: true,
  },
});

voteSchema.plugin(uniqueValidator);

const VoteModel = mongoose.model("votes", voteSchema);

module.exports = VoteModel;
