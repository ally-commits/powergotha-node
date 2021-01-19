const {getDoctor} = require("./getDoctor");
const logger = require("../../logger/logger")

module.exports.checkDoctorPermission = (permission) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if(token) {  
            logger.info("TOKEN:" + token);
            await getDoctor(token,(user) => { 
                if(user == "INVALID_TOKEN") {
                    logger.error("Authentication Error: Invalid Token")

                    res.status(401).json({error: "Authentication Error: Invalid Token"})
                } else  { 
                    logger.info("USER TYPE:"+ user.userType)

                    if(user) {
                        logger.info("Content can be accessed by:" + permission) 
                        req.user = user;
                        next(); 
                    } else {
                        logger.error("Forbidden: user don't have enough access to this content") 
                        res.status(403).json({error: "Forbidden: you don't have enough access to this content"});  
                    }
                }
            })
        } else {
            logger.error("No Token Received " + token) 
            res.status(401).json({error: "Unauthorized Request"})
        }
    }
}
