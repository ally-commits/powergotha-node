const User = require("../../models/User"); 
const Animal = require("../../models/Animal"); 
const Farm = require("../../models/Farm"); 
const AnimalCategory = require("../../models/AnimalCategory"); 

module.exports.getAllDetails = async (req, res) => {
    try {
        const animalCategory = await AnimalCategory.find({}, 'categoryName _id');
        const users = await User.find({}, 'createdAt').sort("createdAt");

        const userMonthCount = await User.aggregate([
            {$group: {
                _id : {month: { $month : "$createdAt" }}, 
                count : { $sum : 1 }
            }},
            {$sort: {
                '_id.month': 1, 
            }}
        ]);
        const animalCatCount = await Animal.aggregate([
            {$group: {
                _id: {"category": "$category"}, 
                animalCount: {$sum: 1} 
            }},     
        ]);
        const animalCount = await Animal.find().count()
        const farmCount = await Farm.find().count()
         
        if(users) {
            res.status(201).json({ users,animalCatCount ,animalCount,farmCount,animalCategory,userMonthCount});
        } else 
            throw Error("Data Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
