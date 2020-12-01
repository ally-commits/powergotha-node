const Farm = require("../../models/Farm"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllFarms = async (req, res) => {
    const userId = req.user._id;
    try {
        const farms = await Farm.find({userId});
        if(farms) {
            res.status(201).json({ farms });
        } else 
            throw Error("farm Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addFarm = [
    body('pincode').not().isEmpty().withMessage("pincode field is required"),
    body('totalArea').not().isEmpty().withMessage("totalArea field is required"), 
    body('farmName').not().isEmpty().withMessage("farmName field is required"),
    body('address').not().isEmpty().withMessage("address field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add Farm")
        const userId = req.user._id;
        const {totalArea,pincode,farmName,address} = req.body;
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

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {totalArea,pincode,farmName,address,farmId} = req.body;
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

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const { farmId } = req.body;
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