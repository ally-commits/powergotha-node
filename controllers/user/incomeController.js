const Income = require("../../models/Income");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
const { data } = require("../../logger/logger");



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
        let {date, incomeType, quantityInLitreMorning, pricePerLitreMorning,quantityInLitreEvening,pricePerLitreEvening, quantityInKg,pricePerKg,animalPrice,otherAmount,about} = req.body;
         
        try { 
            if(incomeType === "Milk Sale Morning"){
                
                income = await Income.create({userId, date, incomeType, quantityInLitreMorning, pricePerLitreMorning}); 
            
            }else if(incomeType === "Milk Sale Evening"){
                
                income = await Income.create({userId, date, incomeType, quantityInLitreEvening, pricePerLitreEvening}); 

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
        const {incomeId,date, incomeType, quantityInLitreMorning, pricePerLitreMorning,quantityInLitreEvening,pricePerLitreEvening, quantityInKg,pricePerKg,animalPrice,otherAmount,about} = req.body;
        try {
            if(incomeType === "Milk Sale Morning"){
                
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{ date, incomeType, quantityInLitreMorning, pricePerLitreMorning}); 
           
           }else if(incomeType === "Milk Sale Evening"){
               
                income = await Income.findByIdAndUpdate({_id: incomeId,userId},{date, incomeType, quantityInLitreEvening, pricePerLitreEvening}); 

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



module.exports.totalIncome = [
    
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
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        quantityInLitreMorning : {$sum : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$sum : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$sum : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$sum : "$pricePerLitreEvening"},    
                        quantityInKg : {$sum : "$quantityInKg"},    
                        pricePerKg : {$sum : "$pricePerKg"},    
                        animalPrice : {$sum : "$animalPrice"},    
                        otherAmount : {$sum : "$otherAmount"},    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
                     }}
                ])
             }else if(filter2 === "AVERAGE"){

                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key : "$date"},
                        quantityInLitreMorning : {$avg : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$avg : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$avg : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$avg : "$pricePerLitreEvening"},    
                        quantityInKg : {$avg : "$quantityInKg"},    
                        pricePerKg : {$avg : "$pricePerKg"},    
                        animalPrice : {$avg : "$animalPrice"},    
                        otherAmount : {$avg : "$otherAmount"},

    
                     }},
                     {$project: {
                         
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
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
                     data = await Income.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                            
                        }},
                        {$group: {
                            _id : {key : "$date"},
                            quantityInLitreMorning : {$sum : "$quantityInLitreMorning"},
                            quantityInLitreEvening : {$sum : "$quantityInLitreEvening"},
                            pricePerLitreMorning : {$sum : "$pricePerLitreMorning"},
                            pricePerLitreEvening : {$sum : "$pricePerLitreEvening"},    
                            quantityInKg : {$sum : "$quantityInKg"},    
                            pricePerKg : {$sum : "$pricePerKg"},    
                            animalPrice : {$sum : "$animalPrice"},    
                            otherAmount : {$sum : "$otherAmount"},    
    
        
                         }},
                         {$project: {
                            quantityInLitreMorning : "$quantityInLitreMorning",
                            quantityInLitreEvening : "$quantityInLitreEvening",
                            pricePerLitreMorning : "$pricePerLitreMorning",
                            pricePerLitreEvening : "$pricePerLitreEvening",    
                            quantityInKg : "$quantityInKg",    
                            pricePerKg : "$pricePerKg", 
                            animalPrice :  "$animalPrice", 
                            otherAmount : "$otherAmount",    
                            totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                            totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
                         }}
                    ]).sort({ "date": -1 });
                    
                }else if(filter2 === "AVERAGE"){
                     data = await Income.aggregate([
                        {$match: {
                            "userId": new mongoose.Types.ObjectId(userId),
                            "date": {$gte:  new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))},
                            
                        }},
                        {$group: {
                            _id : {key : "$date"},
                            quantityInLitreMorning : {$avg : "$quantityInLitreMorning"},
                            quantityInLitreEvening : {$avg : "$quantityInLitreEvening"},
                            pricePerLitreMorning : {$avg : "$pricePerLitreMorning"},
                            pricePerLitreEvening : {$avg : "$pricePerLitreEvening"},    
                            quantityInKg : {$avg : "$quantityInKg"},    
                            pricePerKg : {$avg : "$pricePerKg"},    
                            animalPrice : {$avg : "$animalPrice"},    
                            otherAmount : {$avg : "$otherAmount"},    
    
        
                         }},
                         {$project: {
                            quantityInLitreMorning : "$quantityInLitreMorning",
                            quantityInLitreEvening : "$quantityInLitreEvening",
                            pricePerLitreMorning : "$pricePerLitreMorning",
                            pricePerLitreEvening : "$pricePerLitreEvening",    
                            quantityInKg : "$quantityInKg",    
                            pricePerKg : "$pricePerKg", 
                            animalPrice :  "$animalPrice", 
                            otherAmount : "$otherAmount", 
                            totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                            totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
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
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        quantityInLitreMorning : {$sum : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$sum : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$sum : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$sum : "$pricePerLitreEvening"},    
                        quantityInKg : {$sum : "$quantityInKg"},    
                        pricePerKg : {$sum : "$pricePerKg"},    
                        animalPrice : {$sum : "$animalPrice"},    
                        otherAmount : {$sum : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount",    
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $week : "$date" }},
                        quantityInLitreMorning : {$avg : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$avg : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$avg : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$avg : "$pricePerLitreEvening"},    
                        quantityInKg : {$avg : "$quantityInKg"},    
                        pricePerKg : {$avg : "$pricePerKg"},    
                        animalPrice : {$avg : "$animalPrice"},    
                        otherAmount : {$avg : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
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
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        quantityInLitreMorning : {$sum : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$sum : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$sum : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$sum : "$pricePerLitreEvening"},    
                        quantityInKg : {$sum : "$quantityInKg"},    
                        pricePerKg : {$sum : "$pricePerKg"},    
                        animalPrice : {$sum : "$animalPrice"},    
                        otherAmount : {$sum : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $month : "$date" }},
                        quantityInLitreMorning : {$avg : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$avg : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$avg : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$avg : "$pricePerLitreEvening"},    
                        quantityInKg : {$avg : "$quantityInKg"},    
                        pricePerKg : {$avg : "$pricePerKg"},    
                        animalPrice : {$avg : "$animalPrice"},    
                        otherAmount : {$avg : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
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
                 data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        quantityInLitreMorning : {$sum : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$sum : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$sum : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$sum : "$pricePerLitreEvening"},    
                        quantityInKg : {$sum : "$quantityInKg"},    
                        pricePerKg : {$sum : "$pricePerKg"},    
                        animalPrice : {$sum : "$animalPrice"},    
                        otherAmount : {$sum : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
                     }}
                ])
            }else if(filter2 === "AVERAGE"){
                
                data = await Income.aggregate([
                    {$match: {
                        "userId": new mongoose.Types.ObjectId(userId),
                        "date": {$gte: new Date((new Date().getTime() - ( 24 * 60 * 60 * 1000)))},
                        
                    }},
                    {$group: {
                        _id : {key: { $year : "$date" }},
                        quantityInLitreMorning : {$avg : "$quantityInLitreMorning"},
                        quantityInLitreEvening : {$avg : "$quantityInLitreEvening"},
                        pricePerLitreMorning : {$avg : "$pricePerLitreMorning"},
                        pricePerLitreEvening : {$avg : "$pricePerLitreEvening"},    
                        quantityInKg : {$avg : "$quantityInKg"},    
                        pricePerKg : {$avg : "$pricePerKg"},    
                        animalPrice : {$avg : "$animalPrice"},    
                        otherAmount : {$avg : "$otherAmount"},    

    
                     }},
                     {$project: {
                        quantityInLitreMorning : "$quantityInLitreMorning",
                        quantityInLitreEvening : "$quantityInLitreEvening",
                        pricePerLitreMorning : "$pricePerLitreMorning",
                        pricePerLitreEvening : "$pricePerLitreEvening",    
                        quantityInKg : "$quantityInKg",    
                        pricePerKg : "$pricePerKg", 
                        animalPrice :  "$animalPrice", 
                        otherAmount : "$otherAmount", 
                        totalMilk : {$avg : ["$quantityInLitreMorning", "$quantityInLitreEvening"]},
                        totalPrice : {$avg : ["$pricePerLitreMorning", "$pricePerLitreEvening"]},
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
