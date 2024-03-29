const Doctor = require("../../models/Doctor"); 
const { body, validationResult } = require('express-validator');
const axios = require("axios");
const logger = require("../../logger/logger");

const service_id = process.env.SERVICE_ID;
const template_id = process.env.TEMPLATE_ID_DOCTOR;
const user_id = process.env.USER_ID;
 

module.exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find() 
            
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

module.exports.addDoctor = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('email').not().isEmpty().withMessage("email field is required"),
    body('address').not().isEmpty().withMessage("Address Feild is required"),   
    body('pincode').isLength({ min: 6 }).withMessage("Pincode must be atleast 6 Characters"),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {phoneNumber, password ,name,email,address,pincode} = req.body;
        try {
            const doctor = await Doctor.create({ phoneNumber, password,name,email,address,pincode});
            axios({
                method: "post",
                url: "https://api.emailjs.com/api/v1.0/email/send",
                data: {
                    service_id,
                    template_id,
                    user_id,
                    template_params: {
                        'from_name': 'Agrowon Animal Care', 
                        'to_name': name, 
                        'phoneNumber': phoneNumber, 
                        'password': password,
                        'reply_to': '.', 
                        'send_to': email
                    }
                }
            }).then(res => {
                logger.info("EMAIL SEND AND DOCTOR ADDED")
                res.status(201).json({ doctor: doctor, message: "Doctor Added Successfully",emailSent: true});
            }).catch(err => {
                logger.info("EMAIL SEND ERROR:")
                logger.error(err)
                res.status(201).json({ doctor: doctor, message: "Doctor Added Successfully",emailSent: false});
            })
        }
        catch(err) { 
            let error = err.message
            if(err.code == 11000) {
                error = Object.keys(err.keyValue)[0] + " already exists"
            }
            res.status(400).json({ error: error });
        }  
    }
];

module.exports.editDoctor = [
    body('name').not().isEmpty().withMessage("name field is required"),
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber field is required"),
    body('password').not().isEmpty().withMessage("password field is required"), 
    body('doctorId').not().isEmpty().withMessage("doctorId field is required"), 
    body('email').not().isEmpty().withMessage("email field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        let {phoneNumber,name,doctorId,email} = req.body;

        try { 

            const doctor = await Doctor.findByIdAndUpdate({_id: doctorId},{ phoneNumber,name,email}); 
            if(doctor) {
                const doctorN = await Doctor.findById(doctorId);
                res.status(201).json({ message: "Doctor Updated Successfully",doctor: doctorN}); 
            } else 
                throw Error("No User Data Found")
        }
        catch(err) { 
            let error = err.message 
            if(err.code == 11000) {
                error = Object.keys(err.keyValue)[0] + " already exists"
            }
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteDoctor = [
    body('doctorId').not().isEmpty().withMessage("doctorId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { doctorId } = req.body;
        try {
            const doctor = await Doctor.delete({_id: doctorId}); 
            if(doctor) {
                res.status(201).json({ message: "Doctor Removed Successfully"}); 
            } else 
                throw Error("No Doctor Found") 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]