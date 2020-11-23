const Order = require("../../models/Order"); 
const Cart = require("../../models/Cart");
const { body, validationResult } = require('express-validator');
const mongooose = require("mongoose");
const Product = require("../../models/Product");

module.exports.getAllOrder = async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({userId: userId}).populate("addressId").populate("orderItems.productId");
        if(orders) {
            res.status(201).json({ orders});
        } else
            throw Error("Orders Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addOrder = [
    body('orderItems').not().isEmpty().withMessage("orderItems is required"),
    body('addressId').not().isEmpty().withMessage("addressId is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const session = await mongooose.startSession();
        session.startTransaction();

        const userId = req.user._id;
        const {orderItems,addressId} = req.body;

        try {
            if(orderItems == undefined || orderItems.length == 0) {
                await session.abortTransaction();
                throw Error("Order Should cantain atleast 1 product")
            } else {
                orderItems.forEach(async (item,itemIndex) => {
                    let product = await Product.findById(item.productId).session(session);
                    console.log(product.stockLeft , item.quantity)

                    if(product.stockLeft < item.quantity) {
                        await session.abortTransaction();

                        res.status(400).json({ error: product.productName + " Not available" });
                        return;
                    } else {
                        try {
                            await Product.findByIdAndUpdate(item.productId,{stockLeft: product.stockLeft - parseInt(item.quantity)},{session: session});

                            if(orderItems.length == itemIndex+1) {
                                const order = await Order.create([{orderItems,userId,addressId,orderStatus: "ORDERED"}],{session: session}); 
                                const removeCart = await Cart.deleteMany({userId},{session: session}); 
                                
                                await session.commitTransaction();
                                session.endSession();

                                res.status(201).json({ order, message: "Order Placed"});    
                            }
                        }
                        catch(err) { 
                            await session.abortTransaction();
                            console.log(err)
                            let error = err.message 
                            res.status(400).json({ error: error });
                        }  
                    }
                });
            }
        }
        catch(err) { 
            await session.abortTransaction();

            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];


module.exports.cancelOrder = [
    body('orderId').not().isEmpty().withMessage("orderId is required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user._id;
        const {orderId} = req.body;

        const session = await mongooose.startSession();
        session.startTransaction();

        try { 
            const orderData = await Order.findOne({_id: orderId,userId}).populate("addressId").session(session);
            if(orderData) {
                if(orderData.orderStatus == "CANCELLED") {
                    res.status(400).json({ error: "Order Already Cancelled" });
                } else {
                    orderData.orderItems.forEach(async (item,itemIndex) => {
                        try {
                            const product = await Product.findById(item.productId).session(session);
    
                            await Product.findByIdAndUpdate(item.productId,{stockLeft: product.stockLeft + parseInt(item.quantity)},{session: session});

                            if(itemIndex+1 == orderData.orderItems.length) {
                                const order = await Order.findByIdAndUpdate(orderId,{orderStatus: "CANCELLED"},{session: session}); 
                                if(order) { 
                                    await session.commitTransaction();
                                    session.endSession();
                                    
                                    res.status(201).json({ message: "Order Cancelled"}); 
                                } else {
                                    await session.abortTransaction();
                                    res.status(400).json({ error: "Cannot Update Order Status"});
                                }
                            }
                        }
                        catch(err) { 
                            await session.abortTransaction();
                            console.log(err)
                            let error = err.message 
                            res.status(400).json({ error: error });
                        }   
                    });
                }
            } else {
                throw Error("No Orders Found")
            }
        }
        catch(err) { 
            await session.abortTransaction();

            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];