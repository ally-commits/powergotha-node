const {getUser} = require("./getUser");
const logger = require("../../logger/logger")

module.exports.checkUserPermission = (permission) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if(token) {  
            logger.info("TOKEN:" + token);
            await getUser(token,(user) => { 
                if(user == "INVALID_TOKEN") {
                    logger.error("Authentication Error: Invalid Token")

                    res.status(401).json({error: "Authentication Error: Invalid Token"})
                } else  {  
                    req.user = user;
                    next();  
                }
            })
        } else {
            logger.error("No Token Received " + token) 
            res.status(401).json({error: "Unauthorized Request"})
        }
    }
}
