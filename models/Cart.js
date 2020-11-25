const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Enter Valid Product"],
    ref: "Product"
  },
  quantity: {
    type: Number,
    required: [true, "Quantity field is required"],
    min: [1,"Minimum quantity should be 1"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
},{ timestamps: true });

cartSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;