const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const blogPostSchema = new mongoose.Schema({
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        refPath: "userType"
    }, 
    userType: {
        type: String,
        required: true,
        enum: ["DashboardUser","Doctor"]
    },
    title: {
        type: String,
        required: [true,"Enter valid title"]
    },
    postContent: {
        type: String,
        required: [true,"Enter valid post Content"]
    }, 
    image: {
        type: String,
        required: [true,"Enter valid post image"]
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'likes.userType'
            }, 
            userType: {
                type: String,
                required: true,
                enum: ["User","Doctor"]
            }
        }
    ]
},{ timestamps: true });

blogPostSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;