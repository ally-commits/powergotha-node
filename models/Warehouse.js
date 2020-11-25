const mongoose = require('mongoose'); 
var mongoose_delete = require('mongoose-delete');

const warehouseSchema = new mongoose.Schema({
    coordinates: {
        type: [Number], 
        required: true
    },
    warehouseName: {
        type: String,
        required: true
    },
},{ timestamps: true });

warehouseSchema.plugin(mongoose_delete,{ overrideMethods: ['find','findById','findOne','findOneAndUpdate','findByIdAndUpdate','update']});  

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;