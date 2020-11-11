const Category = require("../../models/Category"); 

module.exports.getAllCategory = async (req, res) => {
    try {
        const category = await Category.find();
        if(category) {
            res.status(201).json({ category });
        } else
            throw Error("Category Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.addCategory = async (req, res) => {
    const {categoryName,description} = req.body;
    try {
        const category = await Category.create({categoryName,description}); 
        res.status(201).json({ category, message: "Category Added Successfully"}); 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.editCategory = async (req, res) => {
    const {categoryName,categoryId,description,active} = req.body;
    try {
        const category = await Category.findByIdAndUpdate({_id: categoryId},{categoryName,description,active}); 
        if(category) {
            const cat = await Category.findById(categoryId);
            res.status(201).json({ message: "Category Updated Successfully",product: cat}); 
        } else
            throw Error("No Category Found")
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}

module.exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.body;
    try {
        const category = await Category.findByIdAndRemove(categoryId); 
        if(category) {
            res.status(201).json({ message: "Category Removed Successfully"}); 
        } else
            throw Error("No Category Found") 
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}
   