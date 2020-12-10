const BreedingRecord = require("../../models/BreedingRecord");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
 

module.exports.getBreedingRecord = [
    query('animalId').not().isEmpty().withMessage("animalId parameter is required"), 

    async (req, res) => {
        const userId = req.user._id;
        let animalId = req.query.animalId; 
        try {   
            const reports = await BreedingRecord.find({animal:animalId,userId});

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

module.exports.addBreedingRecord = [
    body('animal').not().isEmpty().withMessage("animal Feild is required"),
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('numberOfBulls').not().isEmpty().withMessage("numberOfBulls Feild is required"),    
    body('semenCompany').not().isEmpty().withMessage("semenCompany Feild is required"),   
    body('bullMotherYield').not().isEmpty().withMessage("bullMotherYield Feild is required"),   
    body('costForArtificialIncision').not().isEmpty().withMessage("costForArtificialIncision Feild is required"),   
    body('doctorName').not().isEmpty().withMessage("doctorName Feild is required"),   
    body('doctorePhoneNumber').not().isEmpty().withMessage("doctorePhoneNumber Feild is required"),   
    body('pregnancyOfAnimal').not().isEmpty().withMessage("pregnancyOfAnimal Feild is required"),   

    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {animal, date,numberOfBulls,semenCompany,bullMotherYield,costForArtificialIncision,doctorName,doctorePhoneNumber,pregnancyOfAnimal} = req.body;
         
        try { 
            const report = await BreedingRecord.create({animal, date,numberOfBulls,semenCompany,bullMotherYield,costForArtificialIncision,doctorName,doctorePhoneNumber,pregnancyOfAnimal,userId}); 
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
