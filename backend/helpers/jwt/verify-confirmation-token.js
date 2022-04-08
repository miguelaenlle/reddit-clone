const jwt = require("jsonwebtoken");

const verificationTokenIsValid = (verificationToken) => {
  try {
    const decodedToken = jwt.verify(verificationToken, process.env.JWT_KEY);
    return decodedToken.userId;
  } catch (error) {
    throw error;
  }
};

module.exports = verificationTokenIsValid;
