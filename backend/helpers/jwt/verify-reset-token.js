const jwt = require("jsonwebtoken");

const verificationResetTokenIsValid = (
  verificationToken,
  oldHashedPassword
) => {
  try {
    const decodedToken = jwt.verify(verificationToken, oldHashedPassword);
    return decodedToken;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

module.exports = verificationResetTokenIsValid;
