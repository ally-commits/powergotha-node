const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const expenseReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid animal"],
        ref: "User" 
    },
    date: {
        type: Date,
        required: true
    }, 
    expenseType: {
        type: String,
        required: true,
        enum: ["Labour Cost","Medical Expenses","Disinfection Cost","Deworming Cost","Animal Purchase","other"]
    },
    labourCost: {
        type: Number
    },
    doctorVisitFee: {
        type: Number
    },
    treatmentExpense: {
        type: Number
    },
    disinfectionExpense: {
        type: Number
    },
    productUsed: {
        type: String
    },
    dewormingExpense: {
        type: Number
    },
    moleculeUsed: {
        type: String
    },
    animalPurchaseCost: {
        type: Number
    },
    otherCost: {
        type: Number
    },
    about: {
        type: String
    }

},{ timestamps: true });

expenseReportSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Expense = mongoose.model('Expense', expenseReportSchema);

module.exports = Expense;