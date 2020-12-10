const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const healthRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid animal"],
        ref: "User" 
    },
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid animal"],
        ref: "Animal" 
    },
    date: {
        type: Date,
        required: true
    },
    illness: {
        type: String,
        required: true
    },
    lossOfMilk: {
        type: String, 
    },
    treatmentDetails: {
        type: String,
        required: true
    },
    drugDetails: {
        type: String,
        required: true
    }
},{ timestamps: true });

healthRecordSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;