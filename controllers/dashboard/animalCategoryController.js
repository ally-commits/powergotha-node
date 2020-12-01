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

module.exports.addCategory = [
    body('categoryName').not().isEmpty().withMessage("categoryName field is required"), 

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info("add animal Category") 
        const {categoryName} = req.body;
        try {
            const category = await AnimalCategory.create({categoryName}); 
            res.status(201).json({ category, message: "Category Added Successfully"}); 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
];

module.exports.editCategory = [
    body('categoryName').not().isEmpty().withMessage("categoryName field is required"),
    body('categoryId').not().isEmpty().withMessage("categoryId field is required"), 
    

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const {categoryId,categoryName} = req.body;
        try {
            const cat = await AnimalCategory.findByIdAndUpdate({_id: categoryId},{categoryName}); 
            if(cat) {
                const category = await AnimalCategory.findById(categoryId);
                res.status(201).json({ message: "Category Updated Successfully",category}); 
            } else 
                throw Error("No Animal Category Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]

module.exports.deleteCategory = [
    body('categoryId').not().isEmpty().withMessage("categoryId field is required"),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { categoryId } = req.body;
        try {
            const category = await AnimalCategory.delete({_id: categoryId}); 
            if(category) {
                res.status(201).json({ message: "Category Removed Successfully"}); 
            } else 
                throw Error("No Animal Category Found") 
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]