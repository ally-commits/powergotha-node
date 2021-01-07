const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const incomeReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid animal"],
        ref: "User" 
    },
    date: {
        type: Date,
        required: true
    }, 
    incomeType: {
        type: String,
        required: true,
        enum: ["Milk Sale Morning","Milk Sale Evening","Manure Production","Animal Selling","other"]
    },
    quantityInLitre: {
        type: Number
    },
    pricePerLitre: {
        type: Number
    },
    quantityInKg: {
        type: Number
    },
    pricePerKg: {
        type: Number
    },
    animalPrice: {
        type: Number
    },
    otherAmount: {
        type: Number
    },
    about: {
        type: String
    }

},{ timestamps: true });

incomeReportSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Income = mongoose.model('Income', incomeReportSchema);

module.exports = Income;