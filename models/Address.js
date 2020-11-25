const mongoose = require('mongoose'); 
var mongoose_delete = require('mongoose-delete');

const addressSchema = new mongoose.Schema({
  addressType: {
    type: String,
    required: [true, 'Please enter an Address Type'], 
    enum: ["HOME","OFFICE","OTHERS"]
  }, 
  address1: {
    type: String,
    required: [true, 'Please enter an Address 1'], 
  }, 
  address2: {
    type: String,
    required: [true, 'Please enter an Address 2'], 
  }, 
  pincode: {
    type: Number,
    min: [100000,"Enter Valid 6 digit Pincode"],
    max: [999999,"Enter Valid 6 digit Pincode"],
    required: [true, 'Please enter an Pincode'], 
  }, 
  phoneNumber: {
    type: Number,
    min: [1000000000, "Enter valid 10 digit phonenumber"],
    max: [9999999999, "Enter valid 10 digit phonenumber"],
    required: [true, 'Please enter an Phone Number'], 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Enter valid userId"]
  }
},{ timestamps: true });

  
addressSchema.plugin(mongoose_delete ,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;