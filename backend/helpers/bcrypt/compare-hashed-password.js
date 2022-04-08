const bcrypt = require("bcryptjs");

const validatePassword = async (inputtedPassword, hashedPassword) => {
  try {
    const isValidPassword = bcrypt.compare(inputtedPassword, hashedPassword);
    return isValidPassword;
  } catch (error) {
    throw error;
  }
};

module.exports = validatePassword;
