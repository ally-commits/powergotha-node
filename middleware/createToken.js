const jwt = require('jsonwebtoken');
const { secret_key, tokenMaxAge } = require('../config/keys');

module.exports.createToken = (user) => {
    return jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: tokenMaxAge
    });
};