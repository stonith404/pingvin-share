const { scryptSync } = require("crypto");

const hashPassword = (password, salt) => {
    return scryptSync(password, salt, 64).toString("hex");
}

module.exports = {
    hashPassword,
}