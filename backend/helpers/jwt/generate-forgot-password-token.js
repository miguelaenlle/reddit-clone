const jwt = require("jsonwebtoken");

const generateForgotPasswordToken = async (email, id, password) => {
  const token = await jwt.sign(
    {
        userEmail: email,
        userId: id
    },
    password,
    {
      expiresIn: "15m",
    }
  );
  return token;
};

module.exports = generateForgotPasswordToken