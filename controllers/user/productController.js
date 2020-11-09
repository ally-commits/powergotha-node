const Product = require("../../models/Product"); 

module.exports.getAllProduct = async (req, res) => {
    try {
        const product = await Product.find();
        if(product) {
            res.status(201).json({ product});
        } 
        throw Error("Product Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
