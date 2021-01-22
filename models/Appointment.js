const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const appointmentSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid doctorId"],
        refPath: "Doctor"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter a valid userId"],
        refPath: "User"
    },
    cancelled: {
        type: Boolean,
        required: true
    },
    appointmentAccepted : {
        type: Boolean,
        required: true
    }
},{ timestamps: true });

appointmentSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;