const Address = require("../../models/Address"); 
const User = require("../../models/User");  
const Cart = require("../../models/Cart") 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

module.exports.getUserDetails = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).populate("assignedWarehouse");
        if(user) {
            const address = await Address.find({userId});
            const cartItems = await Cart.find({userId}).populate("productId");

            res.status(201).json({ user, address,cartItems});
        } else {
            throw Error("User Not Found");
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
} 

module.exports.updateUserDetails = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Feild is required"),
    body('name').not().isEmpty().withMessage("name Feild is required"), 
    body('dob').not().isEmpty().withMessage("dob Feild is required"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {phoneNumber ,name,dob} = req.body;
         

        try { 
            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,dob}); 
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
                        res.status(201).json({ message: "Password Updated Successfully",user: userN}); 
                    } else 
                        throw Error("No User Data Found")
                         
                } else 
                    throw Error('Incorrect Password');
            } else
                throw Error('User Not Found');
                
        }
        catch(err) { 
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];


