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
    enum: ["USER","ADMIN","MANAGER","DELIVERY-BOY","STORE"], 
  }, 
  dob: {
    type: Date,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
    default: "https://t4.ftcdn.net/jpg/03/46/93/61/360_F_346936114_RaxE6OQogebgAWTalE1myseY1Hbb5qPM.jpg"
  },
  assignedWarehouse: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
  }]
},{ timestamps: true });

userSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 

const User = mongoose.model('User', userSchema);

module.exports = User;