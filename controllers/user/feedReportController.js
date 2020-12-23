const AnimalFeed = require("../../models/AnimalFeed");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
 

module.exports.getFeedReport = [
    query('date').not().isEmpty().withMessage("date parameter is required"), 

    async (req, res) => {
        const userId = req.user._id;
        let date = req.query.date; 
        try {   
            const report = await AnimalFeed.find({userId,date:  {"$gte": new Date(date),"$lte": new Date(date)} });

            if(report) { 
                logger.info("Request sent back");
                res.status(201).json({ report});
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

module.exports.addFeedReport = [ 
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('feedType').not().isEmpty().withMessage("feedType Feild is required"),   
    body('feedName').not().isEmpty().withMessage("feedName Feild is required"),   
    body('quantity').not().isEmpty().withMessage("quantity Feild is required"),   
    body('price').not().isEmpty().withMessage("price Feild is required"),      
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        const userId = req.user._id;
        let {date, feedType, feedName, quantity, price} = req.body;
         
        try { 
            const report = await AnimalFeed.create({date, feedType, feedName, quantity, price,userId}); 
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
