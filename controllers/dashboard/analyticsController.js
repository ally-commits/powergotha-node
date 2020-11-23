const User = require("../../models/User");  
const Order = require("../../models/Order");  


module.exports.getDetails = async (req, res) => {
    try {
        const users = await User.find({}, 'createdAt');
        const orders = await Order.find({}, 'createdAt');
        const ordersDelv = await Order.find({orderStatus: "DELIVERED"}, 'createdAt');
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
         
        res.status(201).json({ currentMonthData, users,orders,ordersDelv}); 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
 

