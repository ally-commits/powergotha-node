const BlogPost = require("../../models/BlogPost"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllBlogPost = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        if(blogPosts) {
            res.status(201).json({ blogPosts });
        } else 
            throw Error("blogPost Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addBlogPost = [  
    body('title').not().isEmpty().withMessage("title field is required"),
    body('postContent').not().isEmpty().withMessage("postContent field is required"),
    body('image').not().isEmpty().withMessage("image field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add blogPost") 
        const addedBy = req.user._id;
        const {userType,title,postContent,image} = req.body;
        try {
            const blogPost = await BlogPost.create({userType: "DashboardUser",title,postContent,image,addedBy}); 
            res.status(201).json({ blogPost, message: "Blog Post Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editBlogPost = [  
    body('title').not().isEmpty().withMessage("title field is required"),
    body('postContent').not().isEmpty().withMessage("postContent field is required"),
    body('image').not().isEmpty().withMessage("image field is required"),
    body('blogId').not().isEmpty().withMessage("blogId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const addedBy = req.user._id;
        const {userType,title,postContent,image,blogId} = req.body;
        try {
            const blogPost = await BlogPost.findByIdAndUpdate({_id: blogId,addedBy},{userType:"DashboardUser",title,postContent,image}); 
            if(blogPost) {
                const blogPostH = await BlogPost.findById(blogId);
                res.status(201).json({ message: "Blog Post Updated Successfully",blogPost: blogPostH}); 
            } else 
                throw Error("No BlogPost Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteBlogPost = [
    body('blogId').not().isEmpty().withMessage("blogId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const addedBy = req.user._id;
        const { blogId } = req.body;
        try { 
            const blogPost = await BlogPost.delete({_id: blogId,addedBy}); 
            if(blogPost) {
                res.status(201).json({ message: "BlogPost Removed Successfully"}); 
            } else 
                throw Error("No BlogPost Found") 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]