const Order = require("../../models/Order"); 
const Cart = require("../../models/Cart");
const { body, validationResult } = require('express-validator');
const mongooose = require("mongoose");
const Product = require("../../models/Product");

module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({path: "addressId",options: { withDeleted: true }})
            .populate({path: "orderItems.productId",options: { withDeleted: true }})
            .populate({path: "userId",options: { withDeleted: true }});
            
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
 


module.exports.updateOrderStatus = [
    body('orderId').not().isEmpty().withMessage("orderId is required"),
    body('orderStatus').not().isEmpty().withMessage("orderStatus is required"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const {orderId,orderStatus} = req.body;

        const session = await mongooose.startSession();
        session.startTransaction();

        try { 
            const orderData = await Order.findOne({_id: orderId}).populate("addressId").session(session);
            if(orderData) {
                if(orderData.orderStatus == "CANCELLED") {
                    res.status(400).json({ error: "Order Already Cancelled" });
                } else {
                    orderData.orderItems.forEach(async (item,itemIndex) => {
                        try {
                            if(orderStatus == "CANCELLED") {
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
                            } else {
                                const order = await Order.findByIdAndUpdate(orderId,{orderStatus: orderStatus},{session: session}); 
                                if(order) { 
                                    await session.commitTransaction();
                                    session.endSession();
                                    
                                    res.status(201).json({ message: "Order Status Updated"}); 
                                } else {
                                    await session.abortTransaction();
                                    res.status(400).json({ error: "Cannot Update Order Status"});
                                }
                            }
                        }
                        catch(err) { 
                            await session.abortTransaction();
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