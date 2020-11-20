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
    body('password').not().isEmpty().withMessage("password Feild is required"),
    body('dob').not().isEmpty().withMessage("dob Feild is required"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {phoneNumber ,name,dob,password} = req.body;
        
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        try { 
            const user = await User.findByIdAndUpdate({_id: userId},{ phoneNumber,name,dob,password}); 
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