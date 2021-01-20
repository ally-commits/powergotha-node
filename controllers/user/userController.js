const User = require("../../models/User");  
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const logger = require("../../logger/logger")

module.exports.getUserDetails = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);

        if(user) {
            logger.info("USER FOUND: " + user)  
            logger.info("Request sent back");
            res.status(201).json({ user});
        } else {
            throw Error("User Not Found");
        }
    }
    catch(err) { 
        logger.error("GET_USER_DETAILS: " + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
} 

module.exports.updateUserDetails = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Feild is required"),
    body('profilePicture').not().isEmpty().withMessage("profilePicture Feild is required"),   
    body('name').not().isEmpty().withMessage("name Feild is required"),   
    body('email').not().isEmpty().withMessage("email Feild is required"),   
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {phoneNumber ,name,profilePicture,email} = req.body;
         
        try { 
            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,profilePicture,email}); 
            if(user) {
                const userN = await User.findById(userId);
                logger.info("User details updated")
                res.status(201).json({ message: "User Updated Successfully",user: userN}); 
            } else 
                throw Error("No User Data Found")
        }
        catch(err) { 
            logger.error("UPDATE USER DETAILS: " + err)
            let error = err.message ;
            if(err.code == 11000) {
                error = Object.keys(err.keyValue)[0] + " already exists"
            }
            res.status(400).json({ error: error });
        }   
    } 
];

module.exports.changePassword = [
    body('oldPassword').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    body('newPassword').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const userId = req.user._id;
        let {newPassword ,oldPassword} = req.body;
        
        const salt = await bcrypt.genSalt();
        newPassword = await bcrypt.hash(newPassword, salt);

        try { 
            const user = await User.findById(userId);
            if(user) {
                const auth = await bcrypt.compare(oldPassword, user.password);
                if(auth) {  
                    const user = await User.findByIdAndUpdate({_id: userId},{ password: newPassword}); 
                    if(user) {
                        const userN = await User.findById(userId);
                        logger.info("Password changed:" + userN)
                        res.status(201).json({ message: "Password Updated Successfully",user: userN}); 
                    } else 
                        throw Error("No User Data Found") 
                } else 
                    throw Error('Incorrect Password');
            } else
                throw Error('User Not Found');
                
        }
        catch(err) { 
            logger.error("CHANGE PASSWORD: " + err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];

module.exports.updatePassword = [ 
    body('newPassword').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const userId = req.user._id;
        let {newPassword} = req.body;
        
        const salt = await bcrypt.genSalt();
        newPassword = await bcrypt.hash(newPassword, salt);

        try { 
            const user = await User.findById(userId);
            if(user) { 
                const user = await User.findByIdAndUpdate({_id: userId},{ password: newPassword}); 
                if(user) {
                    const userN = await User.findById(userId);
                    logger.info("Password changed:" + userN)
                    res.status(201).json({ message: "Password Updated Successfully",user: userN}); 
                } else 
                    throw Error("No User Data Found")  
            } else
                throw Error('User Not Found');
                
        }
        catch(err) { 
            logger.error("CHANGE PASSWORD: " + err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];


module.exports.updateAddress = [ 
    body('address').not().isEmpty().withMessage("Address Feild is required"),   
    body('pincode').isLength({ min: 6 }).withMessage("Pincode must be atleast 6 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const userId = req.user._id;
        let {pincode} = req.body;
        let {address} = req.body;

        try { 
            const user = await User.findById(userId);
            if(user) { 
                const userH = await User.findByIdAndUpdate({_id: userId},{ pincode: pincode, address : address}); 
                res.status(201).json({ message: "Address Updated Successfully",user: userH});  
            } else
            throw Error("No User Data Found")  

        }
        catch(err) { 
            logger.error("ADDRESS : " + err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];
