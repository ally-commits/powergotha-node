const NewsPost = require("../../models/NewsPost"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllNewsPost = async (req, res) => {
    try {
        const newsPosts = await NewsPost.find().populate("addedBy");
        if(newsPosts) {
            res.status(201).json({ newsPosts });
        } else 
            throw Error("newsPosts Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addNewsPost = [  
    body('title').not().isEmpty().withMessage("title field is required"),
    body('postContent').not().isEmpty().withMessage("postContent field is required"),
    body('image').not().isEmpty().withMessage("image field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add newsPost") 
        const addedBy = req.user._id;
        const {userType,title,postContent,image} = req.body;
        try {
            const newsPost = await NewsPost.create({userType: "DashboardUser",title,postContent,image,addedBy}); 
            res.status(201).json({ newsPost, message: "News Post Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editNewsPost = [  
    body('title').not().isEmpty().withMessage("title field is required"),
    body('postContent').not().isEmpty().withMessage("postContent field is required"),
    body('image').not().isEmpty().withMessage("image field is required"),
    body('newsId').not().isEmpty().withMessage("newsId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const addedBy = req.user._id;
        const {userType,title,postContent,image,newsId} = req.body;
        try {
            const newsPost = await NewsPost.findByIdAndUpdate({_id: newsId,addedBy},{userType:"DashboardUser",title,postContent,image}); 
            if(newsPost) {
                const newsPostH = await NewsPost.findById(newsId);
                res.status(201).json({ message: "News Post Updated Successfully",blogPost: newsPostH}); 
            } else 
                throw Error("No NewsPost Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteNewsPost = [
    body('newsId').not().isEmpty().withMessage("newsId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const addedBy = req.user._id;
        const { newsId } = req.body;
        try { 
            const newsPost = await NewsPost.delete({_id: newsId,addedBy}); 
            if(newsPost) {
                res.status(201).json({ message: "News Post Removed Successfully"}); 
            } else 
                throw Error("No NewsPost Found") 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]