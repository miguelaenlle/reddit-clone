const jwt = require("jsonwebtoken");

const generateLoginToken = async (id, email) => {
  const token = await jwt.sign(
    {
      id,
      email,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1w",
    }
  );
  return token;
};

module.exports = generateLoginToken;
