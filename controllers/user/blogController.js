const BlogPost = require("../../models/BlogPost"); 
const User = require("../../models/User");  

const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllBlogPost = async (req, res) => {

    const userId = req.user._id;

    try {
        var allBlog = [];
        var blogPosts = await BlogPost.find({}).populate("addedBy");
        allBlog=blogPosts;
        console.log(typeof(blogPosts)+"typehere");
        if(blogPosts) {
            for(var i = 0;i<=blogPosts.length;i++){
console.log(i);
                var id = blogPosts[i]._id
               console.log(id)
                var data = User.findOne({_id: userId, "favoriteBlogs.blogId" : id})
                if(data){
                    blogPosts.isFavourite = true;
                    console.log("here")
                }else{
                    blogPosts.isFavourite = false;
                    console.log("elsehere")

                }
            }
            res.status(201).json({ response :blogPosts });
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

module.exports.getFavoriteBlogPost = async (req, res) => {
    
    const userId = req.user._id;

    try {
        
        const blogPosts = await User.find({_id: userId});

        
        console.log(blogPosts[0].favoriteBlogs.blogId)

        BlogPost.find({ "_id": { "$in":blogPosts[0].favoriteBlogs.blogId } }).then(blogPost =>
            blogPosts[0].favoriteBlogs.blogId.map(e => blogPost.find(s => s._id.equals(e)))              // compare
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
            const user = await User.findOne({_id: userId,"favoriteBlogs.blogId" : blogId}); 
            if(user) {
                res.status(201).json({ message: "Blog Post already added to favourites"});
                
            } 

            const blogPostsH = await User.findByIdAndUpdate({_id: userId},{$push: {"favoriteBlogs.blogId" : blogId}},{new : true,upsert : true} );
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
            const user = await User.findOne({_id: userId}); 
            if(user) {
                const blogPostsH = await User.findByIdAndUpdate({_id: userId},{$pull: {"favoriteBlogs.blogId" : blogId}});
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

