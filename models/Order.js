const mongoose = require('mongoose'); 

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    default: Date.now() 
  },
  orderedProducts: [{
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Enter Valid Product"],
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: [true, "Enter Valid quantity"]
    }
  }], 
  orderStatus: {
    type: String,
    default: "ORDERED",
    required: true,
    enum: ["ORDERED","SHIPPED","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"], 
  },    
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: [true, "User Not Found"]
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    require: [true, "Enter Valid Address"]
  }
});
  

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;