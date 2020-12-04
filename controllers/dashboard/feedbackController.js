const Feedback = require("../../models/Feedback"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllFeedback = async (req, res) => {
    try { 
        let feedback = await Feedback.find().populate("addedBy");  
 
        if(feedback) {
            res.status(201).json({ feedback});
        } else 
            throw Error("Contents Not Found");
    }
    catch(err) { 
        logger.error(err.message)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.reply = [
    body('addedBy').not().isEmpty().withMessage("addedBy field is required"),
    body('reply').not().isEmpty().withMessage("reply field is required"),
    body('feedbackId').not().isEmpty().withMessage("feedbackId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
         
        const {addedBy,reply,feedbackId} = req.body;

        try {
            const data = await Feedback.findByIdAndUpdate({_id: feedbackId,addedBy},{reply}); 
            if(data) {
                const feedbackH = await Feedback.findById(feedbackId);
                res.status(201).json({ message: "Feedback Updated Successfully",feedback: feedbackH}); 
            } else 
                throw Error("No Feedback Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]