const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const errorMessages = require("../constants/errors");
const verifyLoginToken = require("../helpers/jwt/verify-login-token");
const Subreddit = require("../models/subreddit");
const User = require("../models/user");
const Comment = require("../models/comment")

const getComment = (request, response, next) => {
    return response.status(200).json({
        message: "(PLACEHOLDER) Success."
    })
}