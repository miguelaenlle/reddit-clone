const jwt = require("jsonwebtoken");

const generateSignupToken = async (id) => {
  const token = await jwt.sign(
    {
      userId: id
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

module.exports = generateSignupToken