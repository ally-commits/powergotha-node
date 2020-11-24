const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { createToken } = require("../../middleware/createToken");
const moment = require("moment")
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")

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