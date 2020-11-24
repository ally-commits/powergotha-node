const Product = require("../../models/Product"); 
const logger = require("../../logger/logger")

module.exports.getAllProduct = async (req, res) => {
    try {
        let categoryId = req.query.categoryId;
        let product;
        if(categoryId && categoryId.length == 24) 
            product = await Product.find({categoryId});
        else 
            product = await Product.find();


        if(product) {
            res.status(201).json({ product});
        } else
            throw Error("Product Not Found");
    }
    catch(err) { 
        logger.error("GET ALL PRODUCT:" + err)
        console.log(err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
