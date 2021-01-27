const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');
const bcrypt = require('bcrypt');

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
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [8, 'Minimum password length is 8 characters'],
  }, 
  address: {
    type: String,
  },
  pincode: {
    type: String,
    min: [100000, "Enter valid 6 digit pincode"],
    max: [999999, "Enter valid 6 digit pincode"],
  },
  favoriteBlogs : {
      blogId: [{
        type: mongoose.Schema.Types.ObjectId,
        unique: true, 
      }
      ]
  }
  
},{ timestamps: true });

userSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;