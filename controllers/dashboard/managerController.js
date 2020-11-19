const User = require("../../models/User"); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


module.exports.getAllManagers = async (req, res) => {
    try {
        const managers = await User.find({userType: "MANAGER"}).populate("assignedWarehouse");
        if(managers) {
            res.status(201).json({ managers});
        } else 
            throw Error("Managers Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addManager = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('dob').not().isEmpty().withMessage("dob field is required"),
    body('assignedWarehouse').not().isEmpty().withMessage("assignedWarehouse field is required"),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {phoneNumber, password ,name,dob,assignedWarehouse} = req.body;
        try {
            const user = await User.create({ phoneNumber, password,name,userType: "MANAGER",dob,assignedWarehouse});
            res.status(201).json({ user: user, message: "Manager Added Successfully"});
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

module.exports.editManager = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('dob').not().isEmpty().withMessage("dob field is required"),
    body('assignedWarehouse').not().isEmpty().withMessage("assignedWarehouse field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),
    // body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        let {phoneNumber ,name,dob,assignedWarehouse,userId} = req.body;

        try {
            // const salt = await bcrypt.genSalt();
            // password = await bcrypt.hash(password, salt);

            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,userType: "MANAGER",dob,assignedWarehouse}); 
            if(user) {
                const userN = await User.findById(userId);
                res.status(201).json({ message: "Manager Updated Successfully",user: userN}); 
            } else 
                throw Error("No Manager Data Found")
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteManager = [
    body('userId').not().isEmpty().withMessage("userId must be atleast 8 Characters"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { userId } = req.body;
        try {
            const user = await User.findByIdAndRemove(userId); 
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
   