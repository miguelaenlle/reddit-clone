const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
  pfp_url: {
    type: String,
    required: false,
  },
  num_upvotes: {
    type: Number,
    required: true
  },
  sub_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "subreddits",
    },
  ],
  post_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "comments",
    },
  ],
  comment_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "comments",
    },
  ],
  vote_ids: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "votes",
    },
  ],
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
