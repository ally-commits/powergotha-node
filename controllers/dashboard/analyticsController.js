const User = require("../../models/User");  
const Order = require("../../models/Order");  
const Product = require("../../models/Product")
const logger = require("../../logger/logger");

module.exports.getDetails = async (req, res) => {
    try { 

        const users = await User.find({}, 'createdAt').sort("createdAt");
        const orders = await Order.find({}, 'createdAt').sort("createdAt");
        const ordersDelv = await Order.find({orderStatus: "DELIVERED"}, 'createdAt').sort("createdAt");
        let currentMonthData = {};

        currentMonthData.users = await User.aggregate([
            {$project: {"month" : {$month: '$createdAt'},"createdAt": "$createdAt"}},
            {$match: { month: new Date().getMonth() + 1}}
        ]);
        currentMonthData.orders = await Order.aggregate([
            {$project: {"month" : {$month: '$createdAt'}, "createdAt": "$createdAt"}},
            {$match: { month: new Date().getMonth() + 1}}
        ]);
        currentMonthData.ordersDelv = await Order.aggregate([
            {$project: {"month" : {$month: '$createdAt'},"orderStatus": "$orderStatus","createdAt": "$createdAt"}},
            {$match: { month: new Date().getMonth() + 1, orderStatus: "DELIVERED"}},
        ]);

        const warehouse = await Product.find().populate("warehouseId").select("warehouseId")

        logger.info("GET DETAILS: Response sent back to user")
        
        res.status(201).json({ warehouse, currentMonthData,users,orders,ordersDelv}); 
    }
    catch(err) { 
        logger.error(err);

        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
 

