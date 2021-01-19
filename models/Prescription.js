const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const prescriptionSchema = new mongoose.Schema({
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        refPath: "userType"
    }, 
    userType: {
        type: String,
        required: true,
        enum: ["Doctor"]
    },
    title: {
        type: String,
        required: [true,"Enter valid title"]
    },
    Content: {
        type: String,
        required: [true,"Enter valid post Content"]
    }, 
    image: {
        type: String,
        required: [true,"Enter valid post image"]
    }
},{ timestamps: true });

prescriptionSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;