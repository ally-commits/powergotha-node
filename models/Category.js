const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

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

categorySchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;