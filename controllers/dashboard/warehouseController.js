const Warehouse = require("../../models/Warehouse"); 
const { body, validationResult } = require('express-validator');
const Product = require("../../models/Product");

module.exports.getAllWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.find();
        if(warehouse) {
            res.status(201).json({ warehouse});
        } else 
            throw Error("Warehouse Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addWarehouse = [
    body('coordinates').not().isEmpty().withMessage("coordinates field is required"),
    body('warehouseName').not().isEmpty().withMessage("warehouseName field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {coordinates,warehouseName} = req.body;
        try {
            const warehouse = await Warehouse.create({coordinates,warehouseName}); 
            res.status(201).json({ warehouse, message: "Warehouse Added Successfully"}); 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editWarehouse = [
    body('coordinates').not().isEmpty().withMessage("coordinates field is required"),
    body('warehouseName').not().isEmpty().withMessage("warehouseName field is required"),
    body('warehouseId').not().isEmpty().withMessage("warehouseId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {coordinates,warehouseName,warehouseId} = req.body;
        try {
            const warehouse = await Warehouse.findByIdAndUpdate({_id: warehouseId},{coordinates,warehouseName}); 
            if(warehouse) {
                const wareH = await Warehouse.findById(warehouseId);
                res.status(201).json({ message: "Warehouse Updated Successfully",warehouse: wareH}); 
            } else 
                throw Error("No Warehouse Found")
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteWarehouse = [
    body('warehouseId').not().isEmpty().withMessage("warehouseId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { warehouseId } = req.body;
        try {
            const warehouse = await Warehouse.delete({_id: warehouseId}); 
            if(warehouse) {
                res.status(201).json({ message: "Warehouse Removed Successfully"}); 
            } else 
                throw Error("No Warehouse Found") 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]
   