const DashboardUser = require("../../models/DashboardUser"); 
const { body, validationResult } = require('express-validator');
const axios = require("axios")
const logger = require("../../logger/logger");


const service_id = process.env.SERVICE_ID;
const template_id = process.env.TEMPLATE_ID_CSE;
const user_id = process.env.USER_ID;
 

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
    body('email').not().isEmpty().withMessage("email field is required"),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {phoneNumber, password ,name,userType,email} = req.body;
        try {
            const user = await DashboardUser.create({ phoneNumber, password,name,userType,email});
            axios({
                method: "post",
                url: "https://api.emailjs.com/api/v1.0/email/send",
                data: {
                    service_id,
                    template_id,
                    user_id,
                    template_params: {
                        'from_name': 'Agrowon Animal Care', 
                        'to_name': name, 
                        'phoneNumber': phoneNumber, 
                        'password': password,
                        'reply_to': '.', 
                        'send_to': email
                    }
                }
            }).then(res => {
                logger.info("EMAIL SEND AND USER ADDED")
                res.status(201).json({ user: user, message: "User Added Successfully",emailSent: true});
            }).catch(err => {
                logger.info("EMAIL SEND ERROR:")
                logger.error(err)
                res.status(201).json({ user: user, message: "User Added Successfully",emailSent: false});
            })
        }
        catch(err) { 
            let error = err.message
            if(err.code == 11000) {
                error = Object.keys(err.keyValue)[0] + " already exists"
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
    body('email').not().isEmpty().withMessage("email field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        let {phoneNumber ,name,userId,userType,email} = req.body;

        try { 

            const user = await DashboardUser.findByIdAndUpdate({_id: userId},{ phoneNumber,name,userType,email}); 
            if(user) {
                const userN = await DashboardUser.findById(userId);
                res.status(201).json({ message: "User Updated Successfully",user: userN}); 
            } else 
                throw Error("No User Data Found")
        }
        catch(err) { 
            let error = err.message 
            if(err.code == 11000) {
                error = Object.keys(err.keyValue)[0] + " already exists"
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