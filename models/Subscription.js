const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var mongoose_delete = require('mongoose-delete');

const subscriptionSchema = new mongoose.Schema({
  points: [{
    type: String,
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Please enter a price'], 
  },
  name: {
    type: String,
    required: [true, "Please enter a Name"]
  }
},{ timestamps: true });

subscriptionSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;