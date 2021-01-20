const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const newsPostSchema = new mongoose.Schema({
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        refPath: "userType"
    }, 
    userType: {
        type: String,
        required: true,
        enum: ["DashboardUser"]
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
    }
},{ timestamps: true });

newsPostSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const NewsPost = mongoose.model('NewsPost', newsPostSchema);

module.exports = NewsPost;