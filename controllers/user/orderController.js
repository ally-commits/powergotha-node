const Order = require("../../models/Order"); 
const Cart = require("../../models/Cart");

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

module.exports.addOrder = async (req, res) => {
    const userId = req.user._id;
    const {orderItems,addressId} = req.body;
    try {
        if(orderItems == undefined || orderItems.length == 0) 
            throw Error("Order Should cantain atleast 1 product")
        else {
            const order = await Order.create({orderItems,userId,addressId,orderStatus: "ORDERED"}); 
            const removeCart = await Cart.deleteMany({userId}); 
            res.status(201).json({ order, message: "Order Placed"});    
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.cancelOrder = async (req, res) => {
    const userId = req.user._id;
    const {orderId} = req.body;
    try { 
        const orderData = await Order.findOne({_id: orderId,userId}).populate("addressId");
        if(orderData) {
            if(orderData.orderStatus == "CANCELLED") {
                res.status(400).json({ error: "Order Already Cancelled" });
            } else {
                const order = await Order.findByIdAndUpdate(orderId,{orderStatus: "CANCELLED"}); 
                if(order) { 
                    res.status(201).json({ message: "Order Cancelled",order: {...orderData,orderStatus: "CANCELLED"}}); 
                } else {
                    res.status(400).json({ error: "Connot Update Order Status"});
                }
            }
        } else {
            throw Error("No Orders Found")
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}