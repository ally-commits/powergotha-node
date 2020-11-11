const Address = require("../../models/Address"); 
const User = require("../../models/User"); 

module.exports.getUserDetails = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(user) {
            const address = await Address.find({userId});
            res.status(201).json({ user, address});
        } else {
            throw Error("User Not Found");
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addAddress = async (req, res) => {
    const userId = req.user._id;
    const {addressType,address1,address2, pincode,phoneNumber } = req.body;
    try {
        const address = await Address.create({userId, addressType,address1,address2, pincode,phoneNumber}); 
        res.status(201).json({ address, message: "Address Added Successfully"}); 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.updateAddress = async (req, res) => {
    const userId = req.user._id;
    const {addressType,address1,address2, pincode,phoneNumber,addressId} = req.body;
    try {
        const address = await Address.findOneAndUpdate({_id: addressId,userId},{userId, addressType,address1,address2, pincode,phoneNumber}); 
        if(address) {
            const adr = await Address.findById(addressId);
            res.status(201).json({ message: "Address Updated Successfully",address: adr}); 
        } else {
            throw Error("No Address Found")
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.deleteAddress = async (req, res) => {
    const userId = req.user._id;
    const {addressId} = req.body;
    try {
        const address = await Address.findOneAndRemove({_id:addressId,userId}); 
        if(address) {
            res.status(201).json({ message: "Address Removed Successfully"}); 
        } else {
            throw Error("No Address Found") 
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
   