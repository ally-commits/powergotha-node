const Product = require("../../models/Product"); 
const { body, validationResult } = require('express-validator');
const mongooose = require("mongoose");

module.exports.getAllProduct = async (req, res) => {
    try {
        const user  = req.user;
        let product = [];

        if(user.userType == "ADMIN") 
            product = await Product.find()
                .populate({path: "categoryId",options: { withDeleted: true }})
                .populate({path: "warehouseId",options: { withDeleted: true }})
                .populate({path: "addedBy",options: { withDeleted: true }})
        else
            product = await Product.find({addedBy: user._id})
            .populate({path: "categoryId",options: { withDeleted: true }})
            .populate({path: "warehouseId",options: { withDeleted: true }})
            .populate({path: "addedBy",options: { withDeleted: true }})

        if(product) {
            res.status(201).json({ product});
        } else 
            throw Error("Product Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addProduct = [
    body('productImages').not().isEmpty().withMessage("productImages field is required"),
    body('productName').not().isEmpty().withMessage("productName field is required"),
    body('productPrice').not().isEmpty().withMessage("productPrice field is required"),
    body('categoryId').not().isEmpty().withMessage("categoryId field is required"),
    body('warehouseId').not().isEmpty().withMessage("warehouseId field is required"),
    body('stockLeft').not().isEmpty().withMessage("stockLeft field is required"),
     
    async (req, res) => {
        const addedBy = req.user._id;
        const {productImages,productName,productPrice,categoryId,warehouseId,stockLeft} = req.body;
        
        try {
            const product = await Product.create({productImages,productName,productPrice,categoryId,warehouseId,addedBy,stockLeft}); 
            res.status(201).json({ product, message: "Product Added Successfully"}); 
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.editProduct = [
    body('productImages').not().isEmpty().withMessage("productImages field is required"),
    body('productName').not().isEmpty().withMessage("productName field is required"),
    body('productPrice').not().isEmpty().withMessage("productPrice field is required"),
    body('categoryId').not().isEmpty().withMessage("categoryId field is required"),
    body('warehouseId').not().isEmpty().withMessage("warehouseId field is required"),
    body('productId').not().isEmpty().withMessage("productId field is required"),
    body('stockLeft').not().isEmpty().withMessage("stockLeft field is required"),
    
    async (req, res) => {
        const {productImages,productName,productPrice,productId,categoryId,warehouseId,active,stockLeft} = req.body;
        try {
            const product = await Product.findByIdAndUpdate({_id: productId},{productImages,productName,productPrice,productId,categoryId,warehouseId,active,stockLeft}); 
            if(product) {
                const prod = await Product.findById(productId);
                res.status(201).json({ message: "Product Updated Successfully",product: prod}); 
            } else 
                throw Error("No Product Found")
        }
        catch(err) { 
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.delete({_id: productId}); 
        if(product) {
            res.status(201).json({ message: "Product Removed Successfully"}); 
        } else 
            throw Error("No Product Found") 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
   