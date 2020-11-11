const {getUser} = require("./getUser");

module.exports.checkPermission = (permission) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if(token) { 
            await getUser(token,(user) => { 
                if(user == "INVALID_TOKEN") {
                    res.status(401).json({error: "Authentication Error: Invalid Token"})
                } else  {
                    if(user && permission.includes(user.userType)) {
                        req.user = user;
                        next(); 
                    } else {
                        res.status(403).json({error: "Forbidden: you don't have enough access to this content"});  
                    }
                }
            })
        } else {
            res.status(401).json({error: "Unauthorized Request"})
        }
    }
}