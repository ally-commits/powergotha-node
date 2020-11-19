const mongoose = require('mongoose'); 

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
    ref: "Warehouse",
    required: true
  }
});

  

const Product = mongoose.model('Product', productSchema);
module.exports = Product;