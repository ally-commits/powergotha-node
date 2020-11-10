const Order = require("../../models/Order"); 

module.exports.getAllOrder = async (req, res) => {
    const {userId} = req.body;
    try {
        const orders = await Order.find({userId: userId}).populate("addressId").populate("orderedProducts.product");
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
