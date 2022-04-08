const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12)
    return hashedPassword
}

module.exports = hashPassword