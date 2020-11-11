const User = require("../../models/User");
const bcrypt = require('bcrypt');
const { createToken } = require("../../middleware/createToken");

 

module.exports.register = async (req, res) => {
    const { email, password ,name} = req.body;
    try {
        const user = await User.create({ email, password,name,userType: "USER" });
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