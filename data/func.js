const Category = require("../models/Category");
const Product = require("../models/Product");

const {products} = require("./productData")

module.exports.addProducts = async (req,res) => {
    try { 
        const category  = await Category.find();
        
        products.forEach(product => {
            let data = {...product,categoryId: category[Math.round(Math.random() * (category.length - 1))]._id };
            console.log(data);

            Product.create({...data})
        })
    }   
    catch(err) {
        console.log(err)
    }
}