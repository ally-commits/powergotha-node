const Address = require("../models/Address"); 
const User = require("../models/User"); 

module.exports.getUserDetails = async (req, res) => {
    const { userId} = req.body;
    try {
        const user = await User.findById(userId);
        if(user) {
            const address = await Address.find({userId});

            res.status(201).json({ user, address});
        } 
        throw Error("User Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addAddress = async (req, res) => {
    const { userId, addressType,address1,address2, pincode,phoneNumber } = req.body;
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
    const { userId, addressType,address1,address2, pincode,phoneNumber,addressId} = req.body;
    try {
        const address = await Address.findByIdAndUpdate({_id: addressId},{userId, addressType,address1,address2, pincode,phoneNumber}); 
        if(address) {
            res.status(201).json({ message: "Address Updated Successfully",address}); 
        }
        throw Error("No Address Found")
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.deleteAddress = async (req, res) => {
    const { userId, addressId} = req.body;
    try {
        const address = await Address.findByIdAndRemove(addressId); 
        if(address) {
            res.status(201).json({ message: "Address Removed Successfully"}); 
        }
        throw Error("No Address Found") 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
   