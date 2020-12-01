const User = require("../../models/User");
const { createToken } = require("../../middleware/createToken");
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
 


module.exports.sendOtp = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Feild is required"),
    
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            const { phoneNumber} = req.body;
            if(phoneNumber.length != 10) {
                throw Error("Enter Valid Phone Number");
            } else {
                logger.info("REQUESTED TO SEND OTP: " + phoneNumber); 
                    
                client.verify.services.create({friendlyName: 'PowerGotha'})
                    .then(service => {
                        logger.info(service.sid)   
                        var contact = '+91'+ phoneNumber; 
                        logger.info("Contact number"+ contact); 

                        client.verify.services(service.sid)
                            .verifications
                            .create({to: contact, channel: 'sms'})
                            .then(verification => {
                                logger.info("verification code" + verification.status);
                                
                                res.json({message:"Otp Sent Successfully",sId:service.sid});
                            }).catch(err => {
                                logger.error(err)
                                res.status(400).json({ error: "Could'nt Send Otp" });
                            })
                    })
                    .catch(err => {
                        logger.error(err)
                        res.status(400).json({ error: "Could'nt Send Otp" });
                    }); 
            }
        }
        catch(err) {
            logger.error(err);
            let error = err.message 
            res.status(400).json({ error: error });
        }
    }
]


module.exports.loginWithPhoneNumber = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Feild is required"),
    body('otpValue').not().isEmpty().withMessage("otpValue Feild is required"),
    body('sId').not().isEmpty().withMessage("sId Feild is required"),
    
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            let { phoneNumber,otpValue,sId} = req.body;
            if(phoneNumber.length != 10) {
                throw Error("Enter Valid Phone Number");
            } else {
                logger.info("VERIFY OTP: " + phoneNumber);
                const user = await User.findOne({ phoneNumber });
                if(user) {
                    logger.info("USER FOUND: " + user);  
                    
                    phoneNumber = "+91" + phoneNumber;

                    logger.info("Phone Number:" + phoneNumber);
                    logger.info("OTP VALUE:" + otpValue)
                    logger.info("SID:" + sId)

                    client.verify.services(sId)
                        .verificationChecks
                        .create({to: phoneNumber, code: otpValue})
                        .then(async verification_check => {
                            logger.info(verification_check)
                            logger.info(verification_check.status);

                            if(verification_check.status == "approved") {
                                logger.info("Otp Verified")
                                const token = await createToken(user);
                                res.json({message:"Otp Verified Successfully",token});
                            }else{
                                logger.error("Invalid Otp:" + verification_check.status)
                                res.status(400).json({ error: "Invalid Otp Value"});
                            }
                        }).catch(err => {
                            logger.error(err)
                            res.status(400).json({ error: err.message});
                        })
                } else { 
                    res.status(400).json({ error: "User Not Registred"});
                }
            }
        }
        catch(err) {
            logger.error(err);
            let error = err.message 
            res.status(400).json({ error: error });
        }
    }
] 
module.exports.registerWithPhoneNumber = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Field is required"),
    body('name').not().isEmpty().withMessage("name Field is required"),
    body('email').not().isEmpty().withMessage("email Field is required"),
    body('otpValue').not().isEmpty().withMessage("otpValue Field is required"),
    body('sId').not().isEmpty().withMessage("sId Field is required"),
    
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        try {
            let { phoneNumber,otpValue,sId,name,email} = req.body;
            if(phoneNumber.length != 10) {
                throw Error("Enter Valid Phone Number");
            } else { 
                let to = "+91" + phoneNumber;
                logger.info("VERIFY OTP: " + to);
                client.verify.services(sId)
                    .verificationChecks
                    .create({to: to, code: otpValue})
                    .then(async verification_check => {
                        logger.info(verification_check)
                        logger.info(verification_check.status);

                        if(verification_check.status == "approved") {
                            logger.info("Otp Verified")
                            const user = await User.create({ phoneNumber,name,email,verificationType: "OTP" });
                            if(user) {
                                logger.info("USER FOUND: " + user);  

                                logger.info("Phone Number:" + phoneNumber);
                                logger.info("OTP VALUE:" + otpValue)
                                logger.info("SID:" + sId)

                                const token = await createToken(user);
                                res.json({message:"User registered Successfully",token});
                            } else { 
                                res.status(400).json({ error: "Connot register User"});
                            }
                        } else {
                            logger.error("Invalid Otp:" + verification_check.status)
                            res.status(400).json({ error: "Invalid Otp Value"});
                        }
                    }).catch(err => {
                        logger.error(err)
                        res.status(400).json({ error: err.message});
                    })
            }
        }
        catch(err) {
            logger.error(err);
            let error = err.message 
            res.status(400).json({ error: error });
        }
    }
] 