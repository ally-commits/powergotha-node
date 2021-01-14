const Income = require("../../models/Income"); 
const Expense = require("../../models/Expense");  
const { query,body, validationResult } = require('express-validator');
const logger = require("../../logger/logger")
const mongoose = require("mongoose");
const { data } = require("../../logger/logger");


module.exports.profitLossReport = [
    
    query('filter').not().isEmpty().withMessage("filter parameter is required"),
    query('filter2').not().isEmpty().withMessage("filter2 parameter is required"),

    async (req, res) => {
        const userId = req.user._id;
        let data;
        let filter = req.query.filter;
        let filter2 = req.query.filter2;

        try {   

            if(filter === "today"){
                
               
                 data1 = await Income.aggregate([
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

                        totalIncomeWith : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$animalPrice","$otherAmount"]},
                        totalIncomeWithout : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$otherAmount"]},

                     }}
                ])
             

                 data2 = await Expense.aggregate([
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
                        breedingPrice : {$sum : "$breedingPrice"},        
                        otherCost : {$sum : "$otherCost"}, 
                     }},
                     {$project: {

                        totalExpenseWith : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$animalPurchaseCost","breedingPrice","$otherCost"]},
                        totalExpenseWithout : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","breedingPrice","$otherCost"]},

                     }}
                ])
               
                 if(data1 && data2) { 
                    let data3 = data1.map((item, i) => Object.assign({}, item, data2[i]));
                logger.info("Request sent back");
                res.status(201).json({ data3 });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "daily"){
                
                data1 = await Income.aggregate([
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

                        totalIncomeWith : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$animalPrice","$otherAmount"]},
                        totalIncomeWithout : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$otherAmount"]},

                     }}
                ]).sort({ "date": -1 });
             

                 data2 = await Expense.aggregate([
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
                        breedingPrice : {$sum : "$breedingPrice"},           
                        otherCost : {$sum : "$otherCost"}, 
                     }},
                     {$project: {

                        totalExpenseWith : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$animalPurchaseCost","$breedingPrice","$otherCost"]},
                        totalExpenseWithout : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$breedingPrice","$otherCost"]},

                     }}
                ]).sort({ "date": -1 });

                
                
                if(data1 && data2 ) { 
                    let data3 = data1.map((item, i) => Object.assign({}, item, data2[i]));

                logger.info("Request sent back");
                res.status(201).json({ data3 });
                } else { 
                throw Error("Report Not Found");
                }
            }

            if(filter === "weekly"){
               
                data1 = await Income.aggregate([
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

                        totalIncomeWith : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$animalPrice","$otherAmount"]},
                        totalIncomeWithout : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$otherAmount"]},

                     }}
                ])
             

                 data2 = await Expense.aggregate([
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
                        breedingPrice : {$sum : "$breedingPrice"},           
                        otherCost : {$sum : "$otherCost"}, 
                     }},
                     {$project: {

                        totalExpenseWith : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$animalPurchaseCost","$breedingPrice","$otherCost"]},
                        totalExpenseWithout : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$breedingPrice","$otherCost"]},

                     }}
                ])

                
                if(data1 && data2) { 
                    let data3 = data1.map((item, i) => Object.assign({}, item, data2[i]));
                    logger.info("Request sent back");
                    res.status(201).json({ data3 });
                } else { 
                    throw Error("Report Not Found");
                }
            }

            if(filter === "monthly"){
               
                data1 = await Income.aggregate([
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

                        totalIncomeWith : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$animalPrice","$otherAmount"]},
                        totalIncomeWithout : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$otherAmount"]},

                     }}
                ])
             

                 data2 = await Expense.aggregate([
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
                        breedingPrice : {$sum : "$breedingPrice"},            
                        otherCost : {$sum : "$otherCost"}, 
                     }},
                     {$project: {

                        totalExpenseWith : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$animalPurchaseCost","$breedingPrice","$otherCost"]},
                        totalExpenseWithout : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$breedingPrice","$otherCost"]},

                     }}
                ])


                if(data1 && data2) { 
                    let data3 = data1.map((item, i) => Object.assign({}, item, data2[i]));

                    logger.info("Request sent back");
                    res.status(201).json({ data3 });
                } else { 
                    throw Error("Report Not Found");
                }
            }

            if(filter === "yearly"){
                
                
                data1 = await Income.aggregate([
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

                        totalIncomeWith : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$animalPrice","$otherAmount"]},
                        totalIncomeWithout : {$sum : [{$multiply : ["$quantityInLitreMorning", "$pricePerLitreMorning"]}, {$multiply : ["$quantityInLitreEvening", "$pricePerLitreEvening"]},{$multiply : ["$quantityInKg", "$pricePerKg"]},"$otherAmount"]},

                     }}
                ])
             

                 data2 = await Expense.aggregate([
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
                        breedingPrice : {$sum : "$breedingPrice"},            
                        otherCost : {$sum : "$otherCost"}, 
                     }},
                     {$project: {

                        totalExpenseWith : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$animalPurchaseCost","$breedingPrice","$otherCost"]},
                        totalExpenseWithout : {$sum : ["$labourCost","$doctorVisitFee","$treatmentExpense","$disinfectionExpense","$dewormingExpense","$breedingPrice","$otherCost"]},

                     }}
                ])

                
                if(data1 && data2) { 
                    let data3 = data1.map((item, i) => Object.assign({}, item, data2[i]));
                    logger.info("Request sent back");
                    res.status(201).json({ data3 });
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
