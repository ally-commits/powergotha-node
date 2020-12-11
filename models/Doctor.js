const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var mongoose_delete = require('mongoose-delete');

const doctorSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please enter an PhoneNumber'],
    unique: true, 
    min: [1000000000, "Enter valid 10 digit phonenumber"],
    max: [9999999999, "Enter valid 10 digit phonenumber"],
  },
  email: {
    type:String,
    required: [true, "Enter va valid email"]
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimum password length is 8 characters'],
  },
  name: {
    type: String,
    required: [true, "Please enter a Name"]
  }
},{ timestamps: true });

doctorSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});

doctorSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;