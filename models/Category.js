const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Category Name field is required"],
  },
  description: {
    type: String,
    required: [true, "Description field is required"],
  }, 
  active: {
    type: Boolean,
    default: true,
    required: true
  }, 
},{ timestamps: true });


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;