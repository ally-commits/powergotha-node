const Order = require("../../models/Order"); 

module.exports.getAllOrder = async (req, res) => {
    const {userId} = req.body;
    try {
        const orders = await Order.find({userId: userId}).populate("addressId");
        if(orders) {
            res.status(201).json({ orders});
        } 
        throw Error("Orders Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addOrder = async (req, res) => {
    const {orderedProducts,userId,addressId} = req.body;
    try {
        if(orderedProducts == undefined || orderedProducts.length == 0) 
            throw Error("Order Should cantain atleast 1 product")
        else {
            const order = await Order.create({orderedProducts,userId,addressId,orderStatus: "ORDERED"}); 
            res.status(201).json({ order, message: "Order Placed"});    
        }
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.cancelOrder = async (req, res) => {
    const {userId,orderId} = req.body;
    try { 
        const order = await Order.findByIdAndUpdate({_id: orderId},{orderStatus: "CANCELLED"}); 
        if(order) {
            const orderData = await Order.findById(orderId).populate("addressId");
            res.status(201).json({ message: "Order Cancelled",order: orderData}); 
        } 

        throw Error("No Orders Found")
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}