const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const feedbackSchema = new mongoose.Schema({
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        ref: "User"
    },  
    feedback: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true,
        min: [1,"Minimum rating is 1"],
        max: [5, "Maximum rating is 5"]
    },
    reply: [{
        type: String
    }]
},{ timestamps: true });

feedbackSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const FeedBack = mongoose.model('FeedBack', feedbackSchema);

module.exports = FeedBack;