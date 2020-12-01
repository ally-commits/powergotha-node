const AnimalCategory = require("../../models/AnimalCategory"); 
const { body, validationResult } = require('express-validator');
const logger = require("../../logger/logger"); 

module.exports.getAllCategory = async (req, res) => {
    try {
        const category = await AnimalCategory.find();
        if(category) {
            res.status(201).json({ category });
        } else 
            throw Error("category Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}