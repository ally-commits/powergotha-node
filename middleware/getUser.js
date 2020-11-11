const jwt = require('jsonwebtoken');
const { secret_key } = require('../config/keys');
const User = require('../models/User');

module.exports.getUser = async (token,next) => {
    token = token.replace("Bearer ","")
    await jwt.verify(token, secret_key, async (err,user) => {
        if(err) { 
            next("INVALID_TOKEN")
        } else {
            User.findById(user.userId, function(err,userData) {
                if(err) {
                    next("INVALID_TOKEN")
                } else {
                    next(userData)
                }
            })
        } 
    });
};