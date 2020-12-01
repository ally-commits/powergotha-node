const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please enter an PhoneNumber'],
    unique: true, 
    min: [1000000000, "Enter valid 10 digit phonenumber"],
    max: [9999999999, "Enter valid 10 digit phonenumber"],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimum password length is 8 characters'],
  },
  name: {
    type: String,
    required: [true, "Please enter a Name"]
  },
  userType: {
    type: String,
    required: true,
    enum: ["ADMIN","CSE"], 
  },  
},{ timestamps: true });

userSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 

const DashboardUser = mongoose.model('DashboardUser', userSchema);

module.exports = DashboardUser;