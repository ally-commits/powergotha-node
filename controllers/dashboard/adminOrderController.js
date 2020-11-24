const Order = require("../../models/Order"); 
const logger = require("../../logger/logger")

module.exports.getAllOrder = async (req, res) => {
    const {userId} = req.body;
    try {
        const orders = await Order.find({userId: userId}).populate("addressId").populate("orderedProducts.product");
        if(orders) {
            logger.info("ADMIN ORDER DETAILS: Response sent back to user")
            res.status(201).json({ orders});
        } 
        throw Error("Orders Not Found");
    }
    catch(err) { 
        logger.error(err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
