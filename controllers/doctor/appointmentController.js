const Appointment = require("../../models/Appointment"); 
const { body, validationResult } = require('express-validator');
const axios = require("axios");
const logger = require("../../logger/logger");

module.exports.getAllAppointments = async (req, res) => {

    const userId = req.user._id;
    try {
        const appointments = await Appointment.find({doctor : userId}) 
            
        if(appointments) {
            res.status(201).json({ appointments });
        } else 
            throw Error("Appointments Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.acceptAppointment = [  
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
                const appointmentH = await Appointment.findByIdAndUpdate({_id: appointmentId}, { appointmentAccepted : true });
                res.status(201).json({ message: "Appointment Accepted Successfully",acceptedAppointment : appointmentH}); 
            } else 
                throw Error("Connot Accept appointment")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.rejectAppointment = [  
    body('appointmentId').not().isEmpty().withMessage("doctorId field is required"),

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
                const appointmentH = await Appointment.findByIdAndUpdate({_id: appointmentId}, { appointmentAccepted : false });
                res.status(201).json({ message: "Appointment rejected Successfully",rejectedAppointment : appointmentH}); 
            } else 
                throw Error("Connot reject appointment")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]


