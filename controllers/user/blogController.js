const BlogPost = require("../../models/BlogPost"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllBlogPost = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find().populate("addedBy");
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

module.exports.likeBlogPost = [
    body('blogId').not().isEmpty().withMessage("blogId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const likedBy = req.user._id;
        const { blogId } = req.body;
        try { 
            const blogPost = await BlogPost.findOne({_id: blogId,"likes.user" : likedBy});

            if(blogPost){
                return res.status(400).json({ msg: 'Blog already liked' });
            }
            
            const blog = await BlogPost.findByIdAndUpdate({_id : blogId},{"$push": {"likes.user" : likedBy, "likes.userType" : "User"}},{new : true,upsert : true})
            

            res.status(201).json({ message: "Blog Post Liked Successfully",likes : blog.likes}); 

        }
        catch(err) { 
            logger.error(err.message)
            console.log(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
