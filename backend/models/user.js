const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const atlasPlugin = require("mongoose-atlas-search");

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
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model("users", userSchema);

atlasPlugin.initialize({
  model: UserModel,
  overwriteFind: true,
  searchKey: "search",
  addFields: {
    id: "$_id",
  },
  searchFunction: (query) => {
    return {
      wildcard: {
        query: `${query}*`,
        path: "_id",
        allowAnalyzedField: true,
      },
    };
  },
});

module.exports = UserModel;
