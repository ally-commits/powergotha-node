const User = require("../../models/User"); 
const { body, validationResult } = require('express-validator');
const Farm = require("../../models/Farm");


module.exports.getAllUsers = async (req, res) => {
    try {  
        let users = await User.find(); 
        let farmCount = await Farm.aggregate([{$group: {_id: "$userId",farmCount: {$sum: 1}}}])
        if(users) {
            res.status(201).json({ users,farmCount});
        } else 
            throw Error("Users Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addUser = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('prodilePicture').not().isEmpty().withMessage("prodilePicture field is required"),  

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const {phoneNumber ,name,profilePicture} = req.body;
        try {
            const user = await User.create({ phoneNumber,name,profilePicture,verificationType: "OTP"});
            res.status(201).json({ user: user, message: "User Added Successfully"});
        }
        catch(err) { 
            let error = err.message
            if(err.code == 11000) {
                error = "Phone Number already exists"
            }
            res.status(400).json({ error: error });
        }  
    }
];

module.exports.editUser = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('prodilePicture').not().isEmpty().withMessage("prodilePicture field is required"),   
    body('userId').not().isEmpty().withMessage("userId field is required"),  

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const {phoneNumber ,name,profilePicture,userId} = req.body;

        try { 
            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,profilePicture}); 
            if(user) {
                const userN = await User.findById(userId);
                res.status(201).json({ message: "User Updated Successfully",user: userN}); 
            } else 
                throw Error("No User Data Found")
        }
        catch(err) { 
            let error = err.message ;
            if(err.code == 11000) {
                error = "Phone Number already exists"
            }
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteUser = [
    body('userId').not().isEmpty().withMessage("userId must be atleast 8 Characters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { userId } = req.body;
        try {
            const user = await User.delete({_id: userId}); 
            if(user) {
                res.status(201).json({ message: "User Removed Successfully"}); 
            } else 
                throw Error("No User Found") 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]