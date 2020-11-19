const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  assignedWarehouse: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse"
  }]
});

 
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 

const User = mongoose.model('User', userSchema);

module.exports = User;