const jwt = require("jsonwebtoken");

const verificationTokenIsValid = async (verificationToken) => {
  try {
    const decodedToken = await jwt.verify(
      verificationToken,
      process.env.JWT_KEY
    );
    return decodedToken;
  } catch (error) {
    return 
  }
};

module.exports = verificationTokenIsValid;
