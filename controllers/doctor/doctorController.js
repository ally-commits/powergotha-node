const Doctor = require("../../models/Doctor");
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger");

module.exports.getDoctorDetails = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await Doctor.findById(userId);

        if(user) {
            logger.info("DOCTOR FOUND: " + user)  
            logger.info("Request sent back");
            res.status(201).json({ user});
        } else {
            throw Error("User Not Found");
        }
    }
    catch(err) { 
        logger.error("GET_DOCTOR_DETAILS: " + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
} 
