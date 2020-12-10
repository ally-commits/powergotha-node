const HealthRecord = require("../../models/HealthRecord");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
 

module.exports.getHealthRecord = [
    query('animalId').not().isEmpty().withMessage("animalId parameter is required"), 

    async (req, res) => {
        const userId = req.user._id;
        let animalId = req.query.animalId; 
        try {   
            const reports = await HealthRecord.find({animal: animalId,userId});

            if(reports) { 
                logger.info("Request sent back");
                res.status(201).json({ reports });
            } else { 
                throw Error("Record Not Found");
            }
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]

module.exports.addHealthRecord = [
    body('animal').not().isEmpty().withMessage("animal Feild is required"),
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('illness').not().isEmpty().withMessage("illness Feild is required"),    
    body('lossOfMilk').not().isEmpty().withMessage("lossOfMilk Feild is required"),   
    body('treatmentDetails').not().isEmpty().withMessage("treatmentDetails Feild is required"),   
    body('drugDetails').not().isEmpty().withMessage("drugDetails Feild is required"),   
    
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {animal, date,illness,lossOfMilk,treatmentDetails,drugDetails} = req.body;
         
        try { 
            const report = await HealthRecord.create({animal, date,illness,lossOfMilk,treatmentDetails,drugDetails,userId}); 
            if(report) {  
                res.status(201).json({ message: "Record Added Successfully",report}); 
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
