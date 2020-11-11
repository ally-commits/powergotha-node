const Product = require("../../models/Product"); 

module.exports.getAllProduct = async (req, res) => {
    try {
        const product = await Product.find().populate("categoryId   ");
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

module.exports.addProduct = async (req, res) => {
    const {productImages,productName,productPrice,categoryId} = req.body;
    try {
        const product = await Product.create({productImages,productName,productPrice,categoryId}); 
        res.status(201).json({ product, message: "Product Added Successfully"}); 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.editProduct = async (req, res) => {
    const {productImages,productName,productPrice,productId} = req.body;
    try {
        const product = await Product.findByIdAndUpdate({_id: productId},{productImages,productName,productPrice,productId}); 
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

module.exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        const product = await Product.findByIdAndRemove(productId); 
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
   