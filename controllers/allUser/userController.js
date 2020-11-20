const Address = require("../../models/Address"); 
const User = require("../../models/User");  
const Cart = require("../../models/Cart") 

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