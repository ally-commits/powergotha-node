const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const feedReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid animal"],
        ref: "User" 
    },
    date: {
        type: Date,
        required: true
    }, 
    feedType: {
        type: String,
        required: true
    },
    feedName: {
        type: String,
        required: true, 
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    } 
},{ timestamps: true });

feedReportSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const AnimalFeed = mongoose.model('AnimalFeed', feedReportSchema);

module.exports = AnimalFeed;