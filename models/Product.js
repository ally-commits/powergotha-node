const mongoose = require('mongoose'); 
var mongoose_delete = require('mongoose-delete');

const productSchema = new mongoose.Schema({
  productImages: [{
    type: String, 
    required: true
  }],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  productName: {
    type: String,
    required: [true, "Enter valid Product Name"]
  },
  productPrice: {
    type: Number,
    required: [true, "Enter valid Product Price"]
  },
  active: {
    type: Boolean,
    default: true
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  stockLeft: {
    type: Number,
    required: true
  }
},{ timestamps: true });

productSchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;