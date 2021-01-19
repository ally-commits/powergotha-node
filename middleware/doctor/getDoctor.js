const jwt = require('jsonwebtoken');
const { secret_key } = require('../../config/keys');
const Doctor = require('../../models/Doctor');
const logger = require("../../logger/logger")

module.exports.getDoctor = async (token,next) => {
    token = token.replace("Bearer ","")
    await jwt.verify(token, secret_key, async (err,user) => {
        if(err) { 
            logger.error("GET_USER_TOKEN_ERROR:" + err)
            next("INVALID_TOKEN")
        } else {
            Doctor.findById(user.userId, function(err,userData) {
                if(err || userData == null) {
                    logger.error("GET_USER_DB_NOT USER_FOUND_ERROR:" + err)
                    next("INVALID_TOKEN")
                } else {
                    next(userData)
                }
            })
        } 
    });
};