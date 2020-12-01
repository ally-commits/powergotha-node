const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const farmSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        ref: "User"
    },
    farmName: {
        type: String,
        required: [true, "Enter a valid Farm Name"],
    }, 
    address: {
        type: String,
        required: [true, "Enter a valid Farm Address"],
    }, 
    pincode: {
        type: Number,
        required: [true, "Enter a valid Farm Pincode"],
    }, 
    totalArea: {
        type: Number,
        required: [true, "Enter a valid Farm Total Area"],
    }, 
},{ timestamps: true });

farmSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;