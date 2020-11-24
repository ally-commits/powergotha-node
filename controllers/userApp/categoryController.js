const Category = require("../../models/Category"); 
const logger = require("../../logger/logger");

module.exports.getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();
        if(category) {
            res.status(201).json({ category });
        } else
            throw Error("Category Not Found");
    }
    catch(err) { 
        logger.error("GET CATEGORY: " + err)
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
