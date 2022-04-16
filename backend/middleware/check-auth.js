const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const verifyLoginToken = require("../helpers/jwt/verify-login-token")

const checkAuth = async (request, response, next) => {
  if (request.method === "OPTIONS") {
    return next();
  }
  try {
    console.log("Headers", request.headers);
    const token = request.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = await verifyLoginToken(token, process.env.JWT_KEY);



    request.userData = { userId: decodedToken.id };
    next();
  } catch (error) {
    console.log(error);
    const errorMessage = new HttpError("Authentication failed.", 401);
    return next(errorMessage);
  }
};

module.exports = checkAuth;