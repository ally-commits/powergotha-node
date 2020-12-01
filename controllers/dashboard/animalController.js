const Animal = require("../../models/Animal"); 
const User = require("../../models/User"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllAnimalList = async (req, res) => {
    try {
        let users = await User.find(); 
         
        let animalCount = await Animal.aggregate([
            {$match: { "deleted": { $eq: false } }},
            {$group: {_id: "$userId",count: {$sum: 1}}},
        ]);
        let animalTypeCount = await Animal.aggregate([
            {$match: { "deleted": { $eq: false } }},
            {$group: {_id:{userId: "$userId",category: "$category"},count: {$sum: 1}}},
        ]);

        let animalMap = {};
 
        animalCount.forEach(val => animalMap[val._id] = {animalCount: val.count})
        animalTypeCount.forEach(val => {
            animalMap[val._id.userId] = {
                ...animalMap[val._id.userId],
                animalTypeCount: animalMap[val._id.userId].animalTypeCount ? animalMap[val._id.userId].animalTypeCount + 1 : 1
            }
        })

        if(users) {
            res.status(201).json({ users, animalMap});
        } else 
            throw Error("animal Not Found");
    }
    catch(err) { 
        logger.error(err.message)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addAnimal = [
    body('category').not().isEmpty().withMessage("category field is required"),
    body('farm').not().isEmpty().withMessage("farm field is required"), 
    body('animalBreed').not().isEmpty().withMessage("animalBreed field is required"),
    body('tagNumber').not().isEmpty().withMessage("tagNumber field is required"),
    body('dob').not().isEmpty().withMessage("dob field is required"),
    body('weight').not().isEmpty().withMessage("weight field is required"),
    body('animalType').not().isEmpty().withMessage("animalType field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add animal") 
        const {category,farm,animalBreed,tagNumber,dob,weight,animalType,pregnant,loctating,bornInDairyFarm,purchasingPrice,userId} = req.body;
        try {
            const animal = await Animal.create({category,farm,animalBreed,tagNumber,dob,weight,animalType,pregnant,loctating,bornInDairyFarm,purchasingPrice,userId}); 
            res.status(201).json({ animal, message: "Animal Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editAnimal = [
    body('category').not().isEmpty().withMessage("category field is required"),
    body('farm').not().isEmpty().withMessage("farm field is required"), 
    body('animalBreed').not().isEmpty().withMessage("animalBreed field is required"),
    body('tagNumber').not().isEmpty().withMessage("tagNumber field is required"),
    body('dob').not().isEmpty().withMessage("dob field is required"),
    body('weight').not().isEmpty().withMessage("weight field is required"),
    body('animalType').not().isEmpty().withMessage("animalType field is required"),
    body('animalId').not().isEmpty().withMessage("animalId field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const {category,farm,animalBreed,tagNumber,dob,weight,animalType,pregnant,loctating,bornInDairyFarm,purchasingPrice,animalId,userId} = req.body;
        try {
            const animal = await Animal.findByIdAndUpdate({_id: animalId,userId},{category,farm,animalBreed,tagNumber,dob,weight,animalType,pregnant,loctating,bornInDairyFarm,purchasingPrice}); 
            if(animal) {
                const animalH = await Animal.findById(animalId);
                res.status(201).json({ message: "Animal Updated Successfully",animal: animalH}); 
            } else 
                throw Error("No Animal Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteAnimal = [
    body('animalId').not().isEmpty().withMessage("animalId field is required"),
    body('userId').not().isEmpty().withMessage("userId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const { animalId,userId} = req.body;
        try {
            const animal = await Animal.delete({_id: animalId,userId}); 
            if(animal) {
                res.status(201).json({ message: "Animal Removed Successfully"}); 
            } else 
                throw Error("No Animal Found") 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]