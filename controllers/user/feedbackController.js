const Feedback = require("../../models/Feedback"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllFeedback = async (req, res) => {
    const userId = req.user._id;
    try {
        const feedback = await Feedback.find({userId});
        if(feedback) {
            res.status(201).json({ feedback });
        } else 
            throw Error("Feedback Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addFeedback = [
    body('feedback').not().isEmpty().withMessage("feedback field is required"),
    body('rating').not().isEmpty().withMessage("rating field is required"),  

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add feedback")
        const addedBy = req.user._id;
        const {feedback,rating} = req.body;
        try {
            const data = await Feedback.create({feedback,rating,addedBy}); 
            res.status(201).json({ feedback:data, message: "Feedback Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editFeedback = [
    body('feedback').not().isEmpty().withMessage("feedback field is required"),
    body('rating').not().isEmpty().withMessage("rating field is required"),
    body('feedbackId').not().isEmpty().withMessage("feedbackId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const addedBy = req.user._id;
        const {feedback,rating,feedbackId} = req.body;

        try {
            const data = await Feedback.findByIdAndUpdate({_id: feedbackId,addedBy},{feedback,rating}); 
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

module.exports.deleteFeedback = [
    body('feedbackId').not().isEmpty().withMessage("feedbackId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const addedBy = req.user._id;
        const { feedbackId } = req.body;
        try {
            
            const feedback = await Feedback.delete({_id: feedbackId,addedBy}); 
            if(feedback) {
                res.status(201).json({ message: "Feedback Removed Successfully"}); 
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