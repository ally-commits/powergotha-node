const DashboardUser = require("../../models/DashboardUser"); 
const { body, validationResult } = require('express-validator');


module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await DashboardUser.find() 
            
        if(users) {
            res.status(201).json({ users });
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
    body('userType').not().isEmpty().withMessage("userType field is required"),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {phoneNumber, password ,name,userType} = req.body;
        try {
            const user = await DashboardUser.create({ phoneNumber, password,name,userType});
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
    body('password').not().isEmpty().withMessage("password field is required"), 
    body('userType').not().isEmpty().withMessage("userType field is required"), 
    body('userId').not().isEmpty().withMessage("userId field is required"), 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        let {phoneNumber ,name,userId,userType} = req.body;

        try { 

            const user = await DashboardUser.findByIdAndUpdate({_id: userId},{ phoneNumber,name,userType}); 
            if(user) {
                const userN = await DashboardUser.findById(userId);
                res.status(201).json({ message: "User Updated Successfully",user: userN}); 
            } else 
                throw Error("No User Data Found")
        }
        catch(err) { 
            let error = err.message 
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
            const user = await DashboardUser.delete({_id: userId}); 
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