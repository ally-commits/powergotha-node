const NewsPost = require("../../models/NewsPost"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllNewsPost = async (req, res) => {
    try {
        const newsPosts = await NewsPost.find().populate("addedBy");
        if(newsPosts) {
            res.status(201).json({ newsPosts });
        } else 
            throw Error("newsPosts Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
