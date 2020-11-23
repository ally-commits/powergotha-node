const mongoose = require('mongoose');

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


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;