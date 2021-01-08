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
        let {date, expenseType, labourCost, doctorVisitFee, treatmentExpense,disinfectionExpense,productUsed,dewormingExpense,moleculeUsed,animalPurchaseCost,otherCost,about} = req.body;
         
        try { 
            if(expenseType === "Labour Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, labourCost}); 
            
            }else if(expenseType === "Medical Expenses"){
                
                 expense = await Expense.create({userId, date, expenseType, doctorVisitFee, treatmentExpense}); 

            }else if(expenseType === "Disinfection Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, disinfectionExpense, productUsed}); 

            }else if(expenseType === "Deworming Cost"){
                
                 expense = await Expense.create({userId, date, expenseType, dewormingExpense, moleculeUsed}); 

            }else if(expenseType === "Animal Purchase"){
                
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

           }else if(expenseType === "Animal Purchase"){
               
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




module.exports.totalExpense = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('filter2').not().isEmpty().withMessage("filter2 parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let data;
        let filter = req.query.filter;
        let filter2 = req.query.filter2;

        try {   

            if(filter === "today"){
                
               if(filter2 === "AGGREGATE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        labourCost : {$sum : "$labourCost"},
                        doctorVisitFee : {$sum : "$doctorVisitFee"},
                        treatmentExpense : {$sum : "$treatmentExpense"},
                        disinfectionExpense : {$sum : "$disinfectionExpense"},    
                        dewormingExpense : {$sum : "$dewormingExpense"},    
                        animalPurchaseCost : {$sum : "$animalPurchaseCost"},    
                        otherCost : {$sum : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
             }else if(filter2 === "AVERAGE"){

                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        labourCost : {$avg : "$labourCost"},
                        doctorVisitFee : {$avg : "$doctorVisitFee"},
                        treatmentExpense : {$avg : "$treatmentExpense"},
                        disinfectionExpense : {$avg : "$disinfectionExpense"},    
                        dewormingExpense : {$avg : "$dewormingExpense"},    
                        animalPurchaseCost : {$avg : "$animalPurchaseCost"},    
                        otherCost : {$avg : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
             }else{
                throw Error("Wrong Filter");

             }    
                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                
                if(filter2 === "AGGREGATE"){
                     data = await Expense.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                            
                        }},
                        {$group: {
                            _id : {key : "$date"},
                            labourCost : {$sum : "$labourCost"},
                            doctorVisitFee : {$sum : "$doctorVisitFee"},
                            treatmentExpense : {$sum : "$treatmentExpense"},
                            disinfectionExpense : {$sum : "$disinfectionExpense"},    
                            dewormingExpense : {$sum : "$dewormingExpense"},    
                            animalPurchaseCost : {$sum : "$animalPurchaseCost"},    
                            otherCost : {$sum : "$otherCost"},    
                         }},
                         {$project: {
                            labourCost : "$labourCost",
                            doctorVisitFee : "$doctorVisitFee",
                            treatmentExpense : "$treatmentExpense",
                            disinfectionExpense : "$disinfectionExpense",    
                            dewormingExpense : "$dewormingExpense",    
                            animalPurchaseCost : "$animalPurchaseCost", 
                            otherCost :  "$otherCost", 
                            
                         }}
                    ]).sort({ "date": -1 });
                    
                }else if(filter2 === "AVERAGE"){
                     data = await Expense.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                            
                        }},
                        {$group: {
                            _id : {key : "$date"},
                            labourCost : {$avg : "$labourCost"},
                            doctorVisitFee : {$avg : "$doctorVisitFee"},
                            treatmentExpense : {$avg : "$treatmentExpense"},
                            disinfectionExpense : {$avg : "$disinfectionExpense"},    
                            dewormingExpense : {$avg : "$dewormingExpense"},    
                            animalPurchaseCost : {$avg : "$animalPurchaseCost"},    
                            otherCost : {$avg : "$otherCost"},    
                         }},
                         {$project: {
                            labourCost : "$labourCost",
                            doctorVisitFee : "$doctorVisitFee",
                            treatmentExpense : "$treatmentExpense",
                            disinfectionExpense : "$disinfectionExpense",    
                            dewormingExpense : "$dewormingExpense",    
                            animalPurchaseCost : "$animalPurchaseCost", 
                            otherCost :  "$otherCost", 
                            
                         }}
                    ]).sort({ "date": -1 });
                }else{
                    throw Error("Wrong Filter");
    
                } 

                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
                  
               if(filter2 === "AGGREGATE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        labourCost : {$sum : "$labourCost"},
                        doctorVisitFee : {$sum : "$doctorVisitFee"},
                        treatmentExpense : {$sum : "$treatmentExpense"},
                        disinfectionExpense : {$sum : "$disinfectionExpense"},    
                        dewormingExpense : {$sum : "$dewormingExpense"},    
                        animalPurchaseCost : {$sum : "$animalPurchaseCost"},    
                        otherCost : {$sum : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        labourCost : {$avg : "$labourCost"},
                        doctorVisitFee : {$avg : "$doctorVisitFee"},
                        treatmentExpense : {$avg : "$treatmentExpense"},
                        disinfectionExpense : {$avg : "$disinfectionExpense"},    
                        dewormingExpense : {$avg : "$dewormingExpense"},    
                        animalPurchaseCost : {$avg : "$animalPurchaseCost"},    
                        otherCost : {$avg : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            } 

                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "monthly"){
               
                  
               if(filter2 === "AGGREGATE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        labourCost : {$sum : "$labourCost"},
                        doctorVisitFee : {$sum : "$doctorVisitFee"},
                        treatmentExpense : {$sum : "$treatmentExpense"},
                        disinfectionExpense : {$sum : "$disinfectionExpense"},    
                        dewormingExpense : {$sum : "$dewormingExpense"},    
                        animalPurchaseCost : {$sum : "$animalPurchaseCost"},    
                        otherCost : {$sum : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        labourCost : {$avg : "$labourCost"},
                        doctorVisitFee : {$avg : "$doctorVisitFee"},
                        treatmentExpense : {$avg : "$treatmentExpense"},
                        disinfectionExpense : {$avg : "$disinfectionExpense"},    
                        dewormingExpense : {$avg : "$dewormingExpense"},    
                        animalPurchaseCost : {$avg : "$animalPurchaseCost"},    
                        otherCost : {$avg : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            } 


                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
            }

            if(filter === "yearly"){
                
                  
               if(filter2 === "AGGREGATE"){
                 data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        labourCost : {$sum : "$labourCost"},
                        doctorVisitFee : {$sum : "$doctorVisitFee"},
                        treatmentExpense : {$sum : "$treatmentExpense"},
                        disinfectionExpense : {$sum : "$disinfectionExpense"},    
                        dewormingExpense : {$sum : "$dewormingExpense"},    
                        animalPurchaseCost : {$sum : "$animalPurchaseCost"},    
                        otherCost : {$sum : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                
                data = await Expense.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        labourCost : {$avg : "$labourCost"},
                        doctorVisitFee : {$avg : "$doctorVisitFee"},
                        treatmentExpense : {$avg : "$treatmentExpense"},
                        disinfectionExpense : {$avg : "$disinfectionExpense"},    
                        dewormingExpense : {$avg : "$dewormingExpense"},    
                        animalPurchaseCost : {$avg : "$animalPurchaseCost"},    
                        otherCost : {$avg : "$otherCost"},    
                     }},
                     {$project: {
                        labourCost : "$labourCost",
                        doctorVisitFee : "$doctorVisitFee",
                        treatmentExpense : "$treatmentExpense",
                        disinfectionExpense : "$disinfectionExpense",    
                        dewormingExpense : "$dewormingExpense",    
                        animalPurchaseCost : "$animalPurchaseCost", 
                        otherCost :  "$otherCost", 
                        
                     }}
                ])
            }else{
                throw Error("Wrong Filter");

            }

                 if(data) { 
                logger.info("Request sent back");
                res.status(201).json({ data });
            } else { 
                throw Error("Report Not Found");
            }
            }
             

            
        }
        catch(err) { 
            logger.error(err)
            let error = err.message 
            res.status(400).json({ error: error });
        }   
    } 
]
