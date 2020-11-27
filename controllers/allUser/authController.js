const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { createToken } = require("../../middleware/createToken");
const moment = require("moment")
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports.register = [
    body('name').not().isEmpty(),
    body('phoneNumber').not().isEmpty(),
    body('dob').not().isEmpty(),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { phoneNumber, password ,name,dob} = req.body;
        var a = moment();
        var b = moment(dob, 'YYYY-MM-DD');
        var age = moment.duration(a.diff(b));
        
        if(age.years() < 18) {
            logger.error("REGISTER: Age limit for user " + phoneNumber + "rejected registration");

            res.status(400).json({error: "Only User Above 18 years are allowed"})
        } else {
            try {
                const user = await User.create({ phoneNumber, password,name,userType: "USER",dob});
                const token = await createToken(user);

                logger.info("REGISTER: User Created:" + user)
                logger.info("REGISTER: Token Created:" + token)
                res.status(201).json({ user: user, message: "Succesfully Registered",token});
            }
            catch(err) { 
                logger.error("REGISTER: " +  err)
                let error = err.message
                if(err.code == 11000) {
                    error = "Phone Number already exists"
                }
                res.status(400).json({ error: error });
            }  
        }  
    }
];
  

module.exports.login = [
    body('phoneNumber').not().isEmpty().withMessage("phoneNumber Feild is required"),
    body('password').isLength({ min: 8 }).withMessage("Password must be atleast 8 Characters"),

    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }

        const { phoneNumber, password } = req.body;

        try {
            const user = await User.findOne({ phoneNumber });
            if(user) { 
                logger.info("LOGIN: User FOUND:" + user)
                const auth = await bcrypt.compare(password, user.password);
                if(auth) { 
                    logger.info("Login: User validated ")
                    const token = await createToken(user);
                    res.status(200).json({ user,message: "Succesfully Logged In",token});
                } else {
                    logger.info("LOGIN: wrong password:" + user)
                    throw Error('Incorrect Password');
                }
            } else {
                logger.info("User Not  found")
                throw Error('User Not Found');
            }
        }
        catch(err) { 
            logger.error(err);
            let error = err.message 
            res.status(400).json({ error: error });
        }
    }
]


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
                logger.info("REQUESTED TORESET PASSWORD: " + phoneNumber);
                const user = await User.findOne({ phoneNumber });
                if(user) {
                    logger.info("USER FOUND: " + user);
                    
                    client.verify.services.create({friendlyName: 'YoPaan'})
                        .then(service => {
                            logger.info(service.sid)  

                            var contact = '+91'+ user.phoneNumber;

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


                } else { 
                    throw Error('User Not Found');
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


module.exports.verifyOtp = [
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
                            res.status(400).json({ error: "Something went wrong Try again"});
                        })
                } else { 
                    throw Error('User Not Found');
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
