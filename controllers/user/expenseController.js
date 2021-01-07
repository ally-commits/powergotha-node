const Expense = require("../../models/Expense");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");



module.exports.addExpense = [ 
    body('date').not().isEmpty().withMessage("date Feild is required"),   
    body('expenseType').not().isEmpty().withMessage("expenseType Feild is required"),   
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        var expense
        const userId = req.user._id;
        let {date, expenseType, LabourCost, doctorVisitFee, treatmentExpense,disinfectionExpense,productUsed,dewormingExpense,moleculeUsed,animalPurchaseCost,otherCost,about} = req.body;
         
        try { 
            if(expenseType === "Labour Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, LabourCost}); 
            
            }else if(expenseType === "Medical Expenses"){
                
                 expense = await Expense.create({userId, date, expenseType, doctorVisitFee, treatmentExpense}); 

            }else if(expenseType === "Disinfection Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, disinfectionExpense, productUsed}); 

            }else if(expenseType === "Deworming Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, dewormingExpense, moleculeUsed}); 

            }else if(expenseType === "Animal Purcahse"){
                
                 expense = await Expense.create({userId, date, expenseType, animalPurchaseCost}); 

            }else{
                
                 expense = await Expense.create({userId, date, expenseType, otherCost, about}); 

            }



            if(expense) {  
                res.status(201).json({ message: "Expense Added Successfully",expense}); 
            } else 
                throw Error("Could'nt add expense")
        }
        catch(err) { 
            logger.error(err)
            let error = err.message; 
            res.status(400).json({ error: error });
        }   
    } 
];

module.exports.getAllExpense = async (req, res) => {
    const userId = req.user._id;
    try {
        const expense = await Expense.find({userId});
        if(expense) {
            res.status(201).json({ expense });
        } else 
            throw Error("expense Not Found");
    }
    catch(err) { 
        let error = err.message 
        res.status(400).json({ error: error });
    }   
}


module.exports.editExpense = [
    body('expenseId').not().isEmpty().withMessage("expenseId Feild is required"),   
    

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        var expense
        const userId = req.user._id;
        const {expenseId, date, expenseType, labourCost, doctorVisitFee, treatmentExpense,disinfectionExpense,productUsed,dewormingExpense,moleculeUsed,animalPurchaseCost,otherCost,about} = req.body;
        try {
            if(expenseType === "Labour Cost"){
                
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{ date, expenseType, labourCost}); 
           
           }else if(expenseType === "Medical Expenses"){
               
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{date, expenseType, doctorVisitFee, treatmentExpense}); 

           }else if(expenseType === "Disinfection Cost"){
               
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{ date, expenseType, disinfectionExpense, productUsed}); 

           }else if(expenseType === "Deworming Cost"){
               
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{ date, expenseType, dewormingExpense, moleculeUsed}); 

           }else if(expenseType === "Animal Purcahse"){
               
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{ date, expenseType, animalPurchaseCost}); 

           }else{
               
                expense = await Expense.findByIdAndUpdate({_id: expenseId,userId},{ date, expenseType, otherCost, about}); 

           }

            
            if(expense) {
                const expenseH = await Expense.findById(expenseId);
                res.status(201).json({ message: "Expense Updated Successfully",expense: expenseH}); 
            } else 
                throw Error("No expense Found")
        }
        catch(err) { 
            logger.error(err.message)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    }
]


