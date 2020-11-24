const Product = require("../../models/Product"); 
const logger = require("../../logger/logger")

module.exports.getAllProduct = async (req, res) => {
    try {
        const product = await Product.find();
        if(product) {
            res.status(201).json({ product});
        } else
            throw Error("Product Not Found");
    }
    catch(err) { 
        logger.error("GET ALL PRODUCT:" + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
