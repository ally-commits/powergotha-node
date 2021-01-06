const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const animalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        ref: "User"
    },
    category: {
        type: String,
        required: [true, "Enter a valid animal category"],
    },
    date: {
        type: Date,
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid farm"],
        ref: "Farm"
    },
    animalBreed: {
        type: String,
        required: [true,"Enter valid animal breed"]
    },
    tagNumber: {
        type: String,
        unique: true,
        required: [true,"Enter valid tag Number"]
    },
    dob: {
        type: Date,
        required: [true,"Enter valid Date of birth"]
    },
    weight: {
        type: Number,
        required: [true,"Enter valid weight"]
    },
    animalType: {
        type: String,
        required: [true,"Enter valid animal Type"]
    },
    pregnant: {
        type: Boolean,
        default: false
    },
    loctating: {
        type: Boolean,
        default: false
    },
    bornInDairyFarm: {
        type: Boolean,
        default: false
    },
    purchasingPrice: {
        type: Number
    }
},{ timestamps: true });

animalSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;