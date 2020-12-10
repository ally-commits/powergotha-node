const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const breedingRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
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
    numberOfBulls: {
        type: Number,
        required: true
    },
    semenCompany: {
        type: String,
        required: true
    },
    bullMotherYield: {
        type: Number,
        required: true
    },
    costForArtificialIncision: {
        type: Number,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    doctorePhoneNumber: {
        type: String,
        required: true,
        min: [1000000000, "Enter valid 10 digit phonenumber"],
        max: [9999999999, "Enter valid 10 digit phonenumber"],
    },
    pregnancyOfAnimal: {
        type: String,
        required: true
    }
},{ timestamps: true });

breedingRecordSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const BreedingRecord = mongoose.model('BreedingRecord', breedingRecordSchema);
module.exports = BreedingRecord;