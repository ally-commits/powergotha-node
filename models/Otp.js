const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otpValue: {
    type: String,
    required: [true, "Category Name field is required"],
  }, 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
},{ timestamps: true });


const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;