const Farm = require("../../models/Farm"); 
const User = require("../../models/User"); 
const Animal = require("../../models/Animal"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllFarmList = async (req, res) => {
    try {
        let users = await User.find(); 
         
        let animalCount = await Animal.aggregate([
            {$match: { "deleted": { $eq: false } }},
            {$group: {_id: "$userId",count: {$sum: 1}}},
        ]);
        let farmCount = await Farm.aggregate([
            {$match: { "deleted": { $eq: false } }},
            {$group: {_id: "$userId",count: {$sum: 1}}},
        ]);

        let countMap = {};
 
        animalCount.forEach(val => countMap[val._id] = {animalCount: val.count})
        farmCount.forEach(val => countMap[val._id] = {...countMap[val._id],farmCount: val.count})

        if(users) {
            res.status(201).json({ users, countMap});
        } else 
            throw Error("Contents Not Found");
    }
    catch(err) { 
        logger.error(err.message)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.getFarmDetails = async (req, res) => {
    try {
        let userId = req.query.userId;
        let farms = await Farm.find({userId: userId});  
 
        if(farms) {
            res.status(201).json({ farms});
        } else 
            throw Error("Contents Not Found");
    }
    catch(err) { 
        logger.error(err.message)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addFarm = [
    body('pincode').not().isEmpty().withMessage("pincode field is required"),
    body('totalArea').not().isEmpty().withMessage("totalArea field is required"), 
    body('farmName').not().isEmpty().withMessage("farmName field is required"),
    body('address').not().isEmpty().withMessage("address field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add Farm") 
        const {totalArea,pincode,farmName,address,userId} = req.body;
        try {
            const farm = await Farm.create({totalArea,userId,pincode,farmName,address}); 
            res.status(201).json({ farm, message: "Farm Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editFarm = [
    body('pincode').not().isEmpty().withMessage("pincode field is required"),
    body('totalArea').not().isEmpty().withMessage("totalArea field is required"), 
    body('farmName').not().isEmpty().withMessage("farmName field is required"),
    body('address').not().isEmpty().withMessage("address field is required"),
    body('farmId').not().isEmpty().withMessage("farmId field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const {totalArea,pincode,farmName,address,farmId,userId} = req.body;
        try {
            const farm = await Farm.findByIdAndUpdate({_id: farmId,userId},{totalArea,userId,pincode,farmName,address}); 
            if(farm) {
                const farmH = await Farm.findById(farmId);
                res.status(201).json({ message: "Farm Updated Successfully",farm: farmH}); 
            } else 
                throw Error("No Farm Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteFarm = [
    body('farmId').not().isEmpty().withMessage("farmId field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const { farmId,userId } = req.body;
        try {
            
            const farm = await Farm.delete({_id: farmId,userId}); 
            if(farm) {
                res.status(201).json({ message: "Farm Removed Successfully"}); 
            } else 
                throw Error("No farm Found") 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]