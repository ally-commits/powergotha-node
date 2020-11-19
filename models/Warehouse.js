const mongoose = require('mongoose'); 

const warehouseSchema = new mongoose.Schema({
    coordinates: {
        type: [Number], 
        required: true
    },
    warehouseName: {
        type: String,
        required: true
    },
});

  

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
module.exports = Warehouse;