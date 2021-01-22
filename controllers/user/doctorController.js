const Doctor = require("../../models/Doctor"); 
const Appointment = require("../../models/Appointment"); 
const { body, validationResult } = require('express-validator');
const axios = require("axios");
const logger = require("../../logger/logger");

module.exports.getAllDoctors = async (req, res) => {

    const userPincode = req.user.pincode;
    try {
        const doctors = await Doctor.find({pincode : userPincode}) 
            
        if(doctors) {
            res.status(201).json({ doctors });
        } else 
            throw Error("Doctors Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.askAppointment = [  
    body('doctorId').not().isEmpty().withMessage("doctorId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const {doctorId} = req.body;
        try {
            const appointment = await Appointment.create({doctor: doctorId, user : userId, cancelled : false, appointmentAccepted : false}); 
            if(appointment) {
                res.status(201).json({ message: "Appointment Created Successfully",appointment}); 
            } else 
                throw Error("Connot create appointment")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]


module.exports.cancelAppointment = [  
    body('appointmentId').not().isEmpty().withMessage("appointmentId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //const userId = req.user._id;
        const {appointmentId} = req.body;
        try {
            const appointment = await Appointment.findOne({_id: appointmentId}); 
            if(appointment) {
                const appointmentH = await Appointment.findByIdAndUpdate({_id: appointmentId}, { cancelled : true });
                res.status(201).json({ message: "Appointment cancelled Successfully",cancelledAppointment : appointmentH}); 
            } else 
                throw Error("Connot cancel appointment")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]


