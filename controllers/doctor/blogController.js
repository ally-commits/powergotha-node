const BlogPost = require("../../models/BlogPost"); 
const Doctor = require("../../models/Doctor"); 

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
            const blogPost = await BlogPost.create({userType: "Doctor",title,postContent,image,addedBy}); 
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
            const blogPost = await BlogPost.findByIdAndUpdate({_id: blogId,addedBy},{userType:"Doctor",title,postContent,image}); 
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
            const likes = {"user" : likedBy, "userType" : "Doctor"}
            const blog = await BlogPost.findOneAndUpdate({_id : blogId},{$push: {likes} },{new : true,upsert : true})

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


module.exports.dislikeBlogPost = [
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
                const removeIndex = blogPost.likes.map(like => like.user.toString()).indexOf(likedBy);

                blogPost.likes.splice(removeIndex, 1);

                await blogPost.save();   

                res.status(201).json({ message: "Blog Post Disliked Successfully",likes : blogPost.likes}); 
    
            }


            res.status(400).json({ message: "Cannot dislike Blog Post"}); 

        }
        catch(err) { 
            logger.error(err.message)
            console.log(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
module.exports.getFavoriteBlogPost = async (req, res) => {
    
    const userId = req.user._id;

    try {
        
        const blogPosts = await Doctor.find({_id: userId});

        
        //console.log(blogPosts[0].favoriteBlogs.blogId)

        BlogPost.find({ "_id": { "$in":blogPosts[0].favoriteBlogs.blogId } }).populate("addedBy").then(blogPost =>
            blogPosts[0].favoriteBlogs.blogId.map(e => blogPost.find(s => s._id.equals(e)))              
        ).then(blogPost => {
            if(blogPost) {
                res.status(201).json({ blogPost });
            } else 
                throw Error("blogPost Not Found");
            })
        
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.addToFavorite = [  
    body('blogId').not().isEmpty().withMessage("blogId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {blogId} = req.body;
        try {
            const user = await Doctor.findOne({_id: userId,"favoriteBlogs.blogId" : blogId}); 
            if(user) {
                res.status(201).json({ message: "Blog Post already added to favourites"});
                
            } 

            const blogPostsH = await Doctor.findByIdAndUpdate({_id: userId},{$push: {"favoriteBlogs.blogId" : blogId}},{new : true,upsert : true} );
                res.status(201).json({ message: "Blog Post added to favorite Successfully", favoritedBlog : blogPostsH});
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.removeFromFavorite = [  
    body('blogId').not().isEmpty().withMessage("blogId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {blogId} = req.body;
        try {
            const user = await Doctor.findOne({_id: userId}); 
            if(user) {
                const blogPostsH = await Doctor.findByIdAndUpdate({_id: userId},{$pull: {"favoriteBlogs.blogId" : blogId}});
                res.status(201).json({ message: "Blog Post removed from favorite Successfully", unfavoritedBlog : blogPostsH}); 
            } else 
                throw Error("Connot remove Blog Post from favorite")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

