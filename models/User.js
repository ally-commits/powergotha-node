const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    unique: true, 
    min: [1000000000, "Enter valid 10 digit phonenumber"],
    max: [9999999999, "Enter valid 10 digit phonenumber"],
  },
  email: {
    type: String,
    unique: true,
  }, 
  name: {
    type: String,
    required: [true, "Please enter a Name"]
  },
  profilePicture: {
    type: String, 
    default: "https://www.eccourts.org/wp-content/uploads/2018/05/no-photo.png"
  },   
  verificationType: {
    type: String,
    required: true,
    enum: ['GOOGLE',"FACEBOOK","OTP"]
  }
},{ timestamps: true });

userSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const User = mongoose.model('User', userSchema);

module.exports = User;