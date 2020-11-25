const Address = require("../../models/Address"); 
const User = require("../../models/User"); 
const Order = require("../../models/Order");
const Cart = require("../../models/Cart")
const Product = require("../../models/Product");
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")

module.exports.getUserDetails = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if(user) {
            const address = await Address.find({userId});
            const cartItems = await Cart.find({userId})
                .populate({path: "productId",options: { withDeleted: true }});

            res.status(201).json({ user, address,cartItems});
        } else {
            throw Error("User Not Found");
        }
    }
    catch(err) { 
        logger.error("Get USer Details:" + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addAddress = [
    body('addressType').not().isEmpty().withMessage("addressType is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('address').not().isEmpty().withMessage("address is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber is required"),
    body('pincode').not().isEmpty().withMessage("pincode is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {addressType,address,city,other, pincode,phoneNumber } = req.body;
        try {
            const addressData = await Address.create({userId, addressType,address,city,other, pincode,phoneNumber}); 
            res.status(201).json({ address: addressData, message: "Address Added Successfully"}); 
        }
        catch(err) { 
            logger.error("Add Address:" + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.updateAddress = [
    body('addressType').not().isEmpty().withMessage("addressType is required"),
    body('address').not().isEmpty().withMessage("address is required"),
    body('city').not().isEmpty().withMessage("city is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber is required"),
    body('pincode').not().isEmpty().withMessage("pincode is required"),
    body('addressId').not().isEmpty().withMessage("addressId is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {addressType,address,city, pincode,phoneNumber,addressId,other} = req.body;
        try {
            const addressData = await Address.findOneAndUpdate({_id: addressId,userId},{userId, addressType,address,city,other,pincode,phoneNumber}); 
            if(addressData) {
                const adr = await Address.findById(addressId);
                res.status(201).json({ message: "Address Updated Successfully",address: adr}); 
            } else {
                throw Error("No Address Found")
            }
        }
        catch(err) { 
            logger.error("Edit Address:" + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.deleteAddress = [
    body('addressId').not().isEmpty().withMessage("addressId is required"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {addressId} = req.body;
        try {
            const address = await Address.delete({_id:addressId,userId}); 
            if(address) {
                res.status(201).json({ message: "Address Removed Successfully"}); 
            } else {
                throw Error("No Address Found") 
            }
        }
        catch(err) { 
            logger.error("Delete Address:" + err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];
   

module.exports.productRecommendations = async (req,res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find();

        const orderProducts = {};
        const mostOrdered = {};

        new Promise((resolve,reject) => {
            orders.forEach((order,index) => { 
                if(order.userId.toString() == userId.toString()){
                    order.orderItems.forEach((val,subIndex) => {

                        orderProducts[val.productId.toString()] == null
                            ?
                        orderProducts[val.productId.toString()] = val.quantity
                            :
                        orderProducts[val.productId.toString()] += val.quantity;

                        // RETURN AFTER ALL LOOP EVEN SUB LOOP
                        index == orders.length - 1 && subIndex == order.orderItems.length - 1 && resolve();
                    })
                } else {
                    order.orderItems.forEach((val,subIndex) => { 
                        mostOrdered[val.productId.toString()] == null
                            ?
                        mostOrdered[val.productId.toString()] = val.quantity
                            :
                        mostOrdered[val.productId.toString()] += val.quantity;

                        // RETURN AFTER ALL LOOP EVEN SUB LOOP
                        index == orders.length - 1 && subIndex == order.orderItems.length - 1 && resolve();
                    })
                }
                // RETURN AFTER ALL LOOP
                index == orders.length - 1 && resolve();
            });
        }).then(async () => {
            let arr1 = await Object.keys(orderProducts).sort((a,b)=>orderProducts[a]>orderProducts[b]?1:-1).reduce((a,b)=> {a[b]=orderProducts[b]; return a},{})
            let arr2 = await Object.keys(mostOrdered).sort((a,b)=>mostOrdered[a]>mostOrdered[b]?1:-1).reduce((a,b)=> {a[b]=mostOrdered[b]; return a},{})

            const products = await Product.find().where('_id').in([...Object.keys(arr1),...Object.keys(arr2)]).exec();

            res.status(201).json({ products });                     

        }).catch(err => {
            logger.error("Product Recom:" + err)
            res.status(400).json({ error: "Something went wrong Try Again" });
        })
    }
    catch(err) {
        logger.error("Product Recom:" + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }
}

 