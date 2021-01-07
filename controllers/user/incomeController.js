const Income = require("../../models/Income");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");



module.exports.addIncome = [ 
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('incomeType').not().isEmpty().withMessage("incomeType Feild is required"),   
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        var income
        const userId = req.user._id;
        let {date, incomeType, quantityInLitre, pricePerLitre, quantityInKg,pricePerKg,animalPrice,otherAmount,about} = req.body;
         
        try { 
            if(incomeType === "Milk Sale Morning"){
                
                income = await Income.create({userId, date, incomeType, quantityInLitre, pricePerLitre}); 
            
            }else if(incomeType === "Milk Sale Evening"){
                
                income = await Income.create({userId, date, incomeType, quantityInLitre, pricePerLitre}); 

            }else if(incomeType === "Manure Production"){
                
                income = await Income.create({userId, date, incomeType, quantityInKg, pricePerKg}); 

            }else if(incomeType === "Animal Selling"){
                
                income = await Income.create({userId, date, incomeType, animalPrice}); 

            }else{
                
                income = await Income.create({userId, date, incomeType, otherAmount, about}); 

            }



            if(income) {  
                res.status(201).json({ message: "Income Added Successfully",income}); 
            } else 
                throw Error("Could'nt add Income")
        }
        catch(err) { 
            logger.error(err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];


module.exports.getAllIncome = async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({userId});
        if(income) {
            res.status(201).json({ income });
        } else 
            throw Error("income Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.editIncome = [
    body('incomeId').not().isEmpty().withMessage("incomeId Feild is required"),   
    

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var income
        const userId = req.user._id;
        const {incomeId,date, incomeType, quantityInLitre, pricePerLitre, quantityInKg,pricePerKg,animalPrice,otherAmount,about} = req.body;
        try {
            if(incomeType === "Milk Sale Morning"){
                
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{ date, incomeType, quantityInLitre, pricePerLitre}); 
           
           }else if(incomeType === "Milk Sale Evening"){
               
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{date, incomeType, quantityInLitre, pricePerLitre}); 

           }else if(incomeType === "Manure Production"){
               
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{ date, incomeType, quantityInKg, pricePerKg}); 

           }else if(incomeType === "Animal Selling"){
               
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{ date, incomeType, animalPrice}); 

           }else{
               
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{ date, incomeType, otherAmount, about}); 

           }

            
            if(income) {
                const incomeH = await Income.findById(incomeId);
                res.status(201).json({ message: "Income Updated Successfully",income: incomeH}); 
            } else 
                throw Error("No Income Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]


