const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { createToken } = require("../../middleware/createToken");
const moment = require("moment")
 

module.exports.register = async (req, res) => {
    const { email, password ,name,dob} = req.body;
    if(dob != undefined) {
        var a = moment();
        var b = moment(dob, 'YYYY-MM-DD');
        var age = moment.duration(a.diff(b));
        
        if(age.years() < 18) {
            res.status(400).json({error: "Only User Above 18 years are allowed"})
        } else {
            try {
                const user = await User.create({ email, password,name,userType: "USER",dob});
                const token = await createToken(user);
                res.status(201).json({ user: user, message: "Succesfully Registered",token});
            }
            catch(err) { 
                let error = err.message
                if(err.code == 11000) {
                    error = "Email already exists"
                }
                res.status(400).json({ error: error });
            }  
        } 
    } else {
        res.status(400).json({ error: "Date of Birth Field is required"});
    }
}
  

module.exports.login = async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(user) {
            const auth = await bcrypt.compare(password, user.password);
            if(auth) { 
                const token = await createToken(user);
                res.status(200).json({ user,message: "Succesfully Logged In",token});
            } else 
                throw Error('Incorrect Password');
        } else
            throw Error('User Not Found');
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }
}