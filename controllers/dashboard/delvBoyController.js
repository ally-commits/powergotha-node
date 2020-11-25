const User = require("../../models/User"); 
const { body, validationResult } = require('express-validator');


module.exports.getAllUsers = async (req, res) => {
    try {
        const user = req.user;
        let users = [];
        if(user.userType == "ADMIN") 
            users = await User.find({userType: "DELIVERY-BOY"})
                .populate({path: "assignedWarehouse",options: { withDeleted: true }});
        else
            users = await User.find({userType: "DELIVERY-BOY",assignedWarehouse: {$in: req.user.assignedWarehouse}})
            .populate({path: "assignedWarehouse",options: { withDeleted: true }});

        if(users) {
            res.status(201).json({ users});
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
    body('dob').not().isEmpty().withMessage("dob field is required"), 
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    body('assignedWarehouse').not().isEmpty().withMessage("assignedWarehouse field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const {phoneNumber, password ,name,dob,assignedWarehouse} = req.body;
        try {
            const user = await User.create({ phoneNumber, password,name,userType: "DELIVERY-BOY",dob,assignedWarehouse});
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
    body('dob').not().isEmpty().withMessage("dob field is required"), 
    body('userId').not().isEmpty().withMessage("userId field is required"), 
    body('assignedWarehouse').not().isEmpty().withMessage("assignedWarehouse field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        let {phoneNumber ,name,dob,userId,assignedWarehouse} = req.body;

        try { 
            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,dob,assignedWarehouse}); 
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
   