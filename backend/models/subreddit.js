const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const subredditSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  num_members: {
    type: Number,
    required: true,
  },
  background_image_url: {
    type: String,
    required: false,
  },
  picture_url: {
    type: String,
    required: false,
  }
});

subredditSchema.plugin(uniqueValidator);

const SubredditModel = mongoose.model("subreddits", subredditSchema);

module.exports = SubredditModel;
