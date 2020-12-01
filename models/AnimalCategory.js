const mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

const animalCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Enter a valid animal category"],
  }
},{ timestamps: true });

animalCategorySchema.plugin(mongoose_delete,{ overrideMethods: ['find', 'findOne','findOneAndUpdate', 'update']});
 
const AnimalCategory = mongoose.model('AnimalCategory', animalCategorySchema);

module.exports = AnimalCategory;