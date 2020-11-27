const Category = require("../models/Category");
const Product = require("../models/Product");
const Warehouse = require("../models/Warehouse");

const {products} = require("./productData")
 
module.exports.init = async () => {
    try { 
        const category  = await Category.find();
        const warehouse = await Warehouse.find();
        console.log("came")
        products.forEach(product => {
            let data = {
                ...product,
                categoryId: category[Math.round(Math.random() * (category.length - 1))]._id,
                warehouseId: warehouse[Math.round(Math.random() * (warehouse.length - 1))]._id,
                addedBy: "5fbdfa49ac2a251cd506dbbe",
                stockLeft: 40,
                productName: product.productName.toLowerCase() 
            };
            console.log(data);

            Product.create({...data})
        })
    }   
    catch(err) {
        console.log(err)
    }
}
 
 