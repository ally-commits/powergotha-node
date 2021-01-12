const MilkReport = require("../../models/MilkReport");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
 

module.exports.getMilkReport = [
    query('time').not().isEmpty().withMessage("time parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let date = req.query.date;
        let time = req.query.time;
        try {   
            const data = await MilkReport.find({userId,time }).populate({path: "animal", select: 'tagNumber animalType'});
            //date:  {"$gte": new Date(date),"$lte": new Date(date)}
            if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]

module.exports.addMilkReport = [
    body('animal').not().isEmpty().withMessage("animal Feild is required"),
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('time').not().isEmpty().withMessage("time Feild is required"),   
    body('milkInLiters').not().isEmpty().withMessage("milkInLiters Feild is required"),   
    body('price').not().isEmpty().withMessage("price Feild is required"),   
    body('fat').not().isEmpty().withMessage("fat Feild is required"),   
    body('SNF').not().isEmpty().withMessage("SNF Feild is required"),   
    body('numberOfBacteria').not().isEmpty().withMessage("numberOfBacteria Feild is required"),   
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {animal,date,time,milkInLiters,price,fat,SNF,numberOfBacteria} = req.body;
         
        try { 
            const report = await MilkReport.create({animal,date,time,milkInLiters,price,fat,SNF,numberOfBacteria,userId}); 
            if(report) {  
                res.status(201).json({ message: "Report Added Successfully",report}); 
            } else 
                throw Error("Could'nt add report")
        }
        catch(err) { 
            logger.error(err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];

module.exports.editMilkReport = [
    body('animal').not().isEmpty().withMessage("animal Feild is required"),
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('time').not().isEmpty().withMessage("time Feild is required"),   
    body('milkInLiters').not().isEmpty().withMessage("milkInLiters Feild is required"),   
    body('price').not().isEmpty().withMessage("price Feild is required"),   
    body('fat').not().isEmpty().withMessage("fat Feild is required"),   
    body('SNF').not().isEmpty().withMessage("SNF Feild is required"),   
    body('numberOfBacteria').not().isEmpty().withMessage("numberOfBacteria Feild is required"),
    body('MilkReportId').not().isEmpty().withMessage("MilkReportId Feild is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {animal,date,time,milkInLiters,price,fat,SNF,numberOfBacteria,MilkReportId} = req.body;
        try {
            const milkR = await MilkReport.findByIdAndUpdate({_id: MilkReportId, userId},{animal,date,time,milkInLiters,price,fat,SNF,numberOfBacteria}); 
            if(milkR) {
                const Report = await MilkReport.findById({_id: MilkReportId, userId});
                res.status(201).json({ message: "Milk Report Updated Successfully", milkReport: Report}); 
            } else 
                throw Error("No Milk Report Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
