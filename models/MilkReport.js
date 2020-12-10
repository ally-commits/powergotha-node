const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const milkReportSchema = new mongoose.Schema({
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
    time: {
        type: String,
        required: true,
        enum: ["MORNING","EVENING"]
    },
    milkInLiters: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    SNF: {
        type: Number,
        required: true
    },
    numberOfBacteria: { 
        type: Number,
        required: true
    }
},{ timestamps: true });

milkReportSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const MilkReport = mongoose.model('MilkReport', milkReportSchema);

module.exports = MilkReport;