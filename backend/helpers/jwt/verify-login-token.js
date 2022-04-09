const jwt = require("jsonwebtoken");

const verifyLoginToken = async (jwtToken) => {
  try {
    const decodedToken = await jwt.verify(jwtToken, process.env.JWT_KEY);
    return decodedToken;
  } catch (error) {
    throw error;
  }
};

module.exports = verifyLoginToken;
